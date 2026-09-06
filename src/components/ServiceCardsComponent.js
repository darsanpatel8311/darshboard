import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const delayStep = 0.1;

const ServiceCardsComponent = ({ serviceCards, baseDelay = 0 }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false); // ✅ added

  useEffect(() => { // ✅ added
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    handleResize(); // initial check
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!Array.isArray(serviceCards)) return null;

  return (
    <div className="single_box_grid comm_box_grid">
      {serviceCards.map((card, index) => (
        <motion.div
          key={index}
          className="single_box_design comm_box_design p_0 comm_border_after d_flex flex_column"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: baseDelay + index * delayStep }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div className='comm_inner d_flex flex_column no_gap'>
            <div className="stack_titlebar">
              <div className='social_content d_flex align_center'>
                {card.service_icon && (
                  <span
                    className="social_icon btn_icon comm_btn"
                    dangerouslySetInnerHTML={{ __html: card.service_icon }}
                  />
                )}
                <h5 className="mb_0 followers_count btn_txt">{card.service_title}</h5>
              </div>
            </div>

            <div className='stack_icon_list comm_inner d_flex flex_wrap'>
              <motion.div
                className="small_shadow_box d_flex flex_column align_start"
                animate={{
                  y:
                    hoveredIndex === index
                      ? isMobile
                        ? '-55px' // ✅ mobile value
                        : '-4.557291666666666vw' // desktop value
                      : '0',
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 40 }}
              >
                <div className="small_shadow_box_head w_100">
                  <p className='justify_between d_flex gap_10 align_center'>
                    {card.projects_completed_text}
                    <strong>{card.projects_completed_count}+</strong>
                  </p>
                </div>
                <div className='small_shadow_box_body'>
                  <h6>{card.service_tagline}</h6>
                  <p>{card.service_description}</p>
                </div>
                <div className='small_shadow_box_price w_100'>
                  <p className='d_flex justify_between gap_10'>
                    Startes From <strong>${card.service_starting_price}</strong>
                  </p>
                </div>
              </motion.div>
              <div className='small_shadow_box_footer w_100'>
                <a href={card.button_url} target='_blank' rel='noreferrer' className="d_mail_box justify_center d_flex w_100">
                  <span className='line_none'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5625vw" height="1.5625vw" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--global-palette2)' }}>
                      <path fill="currentColor" fillRule="evenodd" d="M3.172 5.172C2 6.343 2 8.229 2 12c0 3.771 0 5.657 1.172 6.828C4.343 20 6.229 20 10 20h4c3.771 0 5.657 0 6.828-1.172C22 17.657 22 15.771 22 12c0-3.771 0-5.657-1.172-6.828C19.657 4 17.771 4 14 4h-4C6.229 4 4.343 4 3.172 5.172zM18.576 7.52a.75.75 0 0 1-.096 1.056l-2.196 1.83c-.887.74-1.605 1.338-2.24 1.746-.66.425-1.303.693-2.044.693-.741 0-1.384-.269-2.045-.693-.634-.408-1.352-1.007-2.239-1.745L5.52 8.577a.75.75 0 0 1 .96-1.153l2.16 1.799c.933.777 1.58 1.315 2.128 1.667.529.34.888.455 1.233.455.345 0 .704-.114 1.233-.455.547-.352 1.195-.89 2.128-1.667l2.159-1.8a.75.75 0 0 1 1.056.097z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span>{card.button_text}</span>
                </a>
              </div>
            </div>

          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ServiceCardsComponent;
