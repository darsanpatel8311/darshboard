const ProjectsComponent = ({ projectsData }) => {
    if (!projectsData) return null;

    const {
        projects_icon,
        projects_label,
        projects_title,
        projects_subtitle,
        projects_button,
        projects_button_icon,
        project_card,
    } = projectsData;

    return (
        <div className="comm_inner d_flex flex_column no_gap ">
            <div className="d_flex  justify_between gap_10 projects_topbar">

                <div className="stack_titlebar d_flex flex_column ">
                    <div className="stack_top_head d_flex  align_center">
                        {projects_icon && (
                            <span
                                className="top_icon line_none"
                                dangerouslySetInnerHTML={{ __html: projects_icon }}
                            />
                        )}
                        {projects_label && (
                            <p className="stack_top_para mb_0">{projects_label}</p>
                        )}
                    </div>
                    <div className="stack_top_body">
                        {projects_title && <h4>{projects_title}</h4>}
                        {projects_subtitle && <p className="mb_0">{projects_subtitle}</p>}
                    </div>
                </div>
                {projects_button && (
                    <div className="projects_button_wrapper">
                        <a href="darshboard.com" className="view_all_btn d_mail_box">
                            <span>{projects_button}</span>
                            {projects_button_icon && (
                                <span className="d_inline_flex"
                                    dangerouslySetInnerHTML={{ __html: projects_button_icon }}
                                />
                            )}
                        </a>
                    </div>
                )}
            </div>
            <div className="stack_icon_list comm_inner d_flex flex_wrap projects_list">
                {project_card?.map((item, index) => (
                    <div key={index} className="stack_item stat_item d_flex align_center">
                        <a href={item.project_card_link} target="_blank" rel="noreferrer" className="stack_content d_flex align_center flex_column justify_center w_100">
                            <div className="project_card_img_box w_100">
                                {item.project_card_image?.url && (
                                    <img
                                        src={item.project_card_image.url}
                                        alt={item.project_card_image.alt || item.project_card_title}
                                        className="project_card_img"
                                    />
                                )}
                            </div>
                            <div className="d_flex w_100 project_card_footer">
                                <div className="stack_icon_list_inner d_flex flex_column w_100">
                                    {item.project_card_title && (
                                        <h6 className="mb_0 stack_title btn_txt">
                                            {item.project_card_title}
                                        </h6>
                                    )}
                                    {item.project_card_category && (
                                        <div className="stack_label comm_work_txt mb_0">
                                            {item.project_card_category}
                                        </div>
                                    )}
                                </div>
                                <span className="top_icon line_none custom_arrow" >
                                <svg xmlns="http://www.w3.org/2000/svg"  width="1.5625vw" height="1.5625vw" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"/></svg>
                                </span>
                            </div>
                        </a>
                    </div>
                ))}
            </div>

            {/* Optional Button at the bottom */}

        </div>
    );
};

export default ProjectsComponent;
