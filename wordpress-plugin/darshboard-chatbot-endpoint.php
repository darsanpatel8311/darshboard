<?php
/**
 * Plugin Name: Darshboard Chatbot Endpoint
 * Description: Free predefined-response REST API for the Darshboard React chatbot.
 * Version: 1.0.0
 * Author: Darshboard
 */

defined( 'ABSPATH' ) || exit;

interface Darshboard_Chatbot_Response_Provider {
	public function get_response( $message, $history );
}

class Darshboard_Predefined_Chatbot_Provider implements Darshboard_Chatbot_Response_Provider {
	private $knowledge_base = array(
		'services' => array(
			'keywords' => array( 'service', 'website', 'web app', 'development', 'wordpress', 'react' ),
			'answer'   => 'I build fast, responsive websites and web apps with React, WordPress, and modern front-end tools. What are you planning to build?',
		),
		'availability' => array(
			'keywords' => array( 'availability', 'available', 'hire', 'start', 'timeline', 'project' ),
			'answer'   => 'Please share a little about your project, timeline, and goals. Darshan will get back to you with current availability.',
		),
		'tech_stack' => array(
			'keywords' => array( 'tech stack', 'technology', 'technologies', 'stack', 'skills' ),
			'answer'   => 'The core stack includes React, JavaScript, HTML, CSS, WordPress, and performance-focused front-end development.',
		),
		'recent_work' => array(
			'keywords' => array( 'recent work', 'portfolio', 'project', 'projects', 'work' ),
			'answer'   => 'You can explore selected projects in the My Works section. If you have a similar project in mind, send the details here.',
		),
		'ai_agents' => array(
			'keywords' => array( 'ai agent', 'ai agents', 'automation', 'artificial intelligence' ),
			'answer'   => 'I can help you explore practical AI features for your website or workflow. Tell me what you would like the agent to do.',
		),
		'location' => array(
			'keywords' => array( 'location', 'based', 'country', 'remote', 'timezone' ),
			'answer'   => 'Darshan works remotely with clients across time zones, so we can find a time that works for your team.',
		),
		'greeting' => array(
			'keywords' => array( 'hello', 'hi', 'hey', 'good morning', 'good afternoon' ),
			'answer'   => 'Hello! I can help with services, availability, technical skills, recent projects, and location. What would you like to know?',
		),
	);

	public function get_response( $message, $history ) {
		foreach ( $this->knowledge_base as $intent => $item ) {
			foreach ( $item['keywords'] as $keyword ) {
				$pattern = '/(?:^|[^\\p{L}\\p{N}])' . preg_quote( $keyword, '/' ) . '(?=$|[^\\p{L}\\p{N}])/iu';

				if ( 1 === preg_match( $pattern, $message ) ) {
					return array(
						'answer' => $item['answer'],
						'intent' => $intent,
					);
				}
			}
		}

		return array(
			'answer' => 'Thanks for your message. I can currently help with services, availability, tech stack, recent work, AI agents, or location. Please choose one of those topics or send your project details through the contact form.',
			'intent' => 'fallback',
		);
	}
}

class Darshboard_Chatbot_REST_Controller {
	private $provider;

	public function __construct( Darshboard_Chatbot_Response_Provider $provider ) {
		$this->provider = $provider;
	}

	public function register_routes() {
		register_rest_route(
			'darshboard-chat/v1',
			'/message',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'send_message' ),
				'permission_callback' => '__return_true',
				'args'                => array(
					'message' => array(
						'required'          => true,
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_textarea_field',
					),
					'history' => array(
						'required' => false,
						'type'     => 'array',
					),
				),
			)
		);
	}

	public function send_message( WP_REST_Request $request ) {
		$message = trim( (string) $request->get_param( 'message' ) );

		if ( '' === $message || strlen( $message ) > 500 ) {
			return new WP_Error( 'invalid_message', 'Please send a message between 1 and 500 characters.', array( 'status' => 400 ) );
		}

		$history = array_slice( (array) $request->get_param( 'history' ), -20 );
		$result  = $this->provider->get_response( $message, $history );

		return rest_ensure_response(
			array(
				'success' => true,
				'data'    => array(
					'answer' => $result['answer'],
					'intent' => $result['intent'],
				),
			)
		);
	}
}

add_action(
	'rest_api_init',
	function () {
		$provider   = apply_filters( 'darshboard_chatbot_response_provider', new Darshboard_Predefined_Chatbot_Provider() );
		$controller = new Darshboard_Chatbot_REST_Controller( $provider );
		$controller->register_routes();
	}
);
