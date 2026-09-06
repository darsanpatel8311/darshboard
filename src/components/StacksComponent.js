import React from "react";

const StacksComponent = ({ stackData }) => {
    if (!stackData) return null;

    const {
        stack_icon_box_list,
        stack_topbar,
    } = stackData;

    // The stack heading fields are supplied by ACF as the `stack_topbar` group.
    // Keep the root-level fallback so existing flat payloads continue to render.
    const {
        stack_top_icon,
        stack_top_title,
        stack_top_text,
    } = stack_topbar || stackData;

    return (
        <div className="comm_inner d_flex flex_column no_gap">
            {/* Render Top Section */}
            <div className="stack_titlebar d_flex flex_column align_center">
                <div className="stack_top_head d_flex justify_center align_center">
                    {stack_top_icon && (
                        <span className="top_icon line_none" dangerouslySetInnerHTML={{ __html: stack_top_icon }} />
                    )}
                    {stack_top_text && <p className="stack_top_para mb_0">{stack_top_text}</p>}
                </div>
                <div className="stack_top_body">
                    {stack_top_title && <h2 className="h4">{stack_top_title}</h2>}
                </div>
            </div>
            <div className="stack_icon_list comm_inner d_flex flex_wrap">
            {/* Render Stack Items */}
            {stack_icon_box_list?.map((item, index) => (
                <div key={index} className="stack_item  stat_item d_flex align_center">
                    <div className='stack_content d_flex align_center'>
                        {item.stack_icon && (
                            <span
                                className="stack_icon btn_icon comm_btn"
                                dangerouslySetInnerHTML={{ __html: item.stack_icon }}
                            />
                        )}
                        <div className='stack_icon_list_inner d_flex flex_column'>
                            {item.stack_title && (
                                <h5 className="mb_0 stack_title btn_txt">{item.stack_title}</h5>
                            )}
                            {item.stack_desc && (
                                <div className="stack_label comm_work_txt mb_0">{item.stack_desc}</div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            </div>
        </div>
    );
};

export default StacksComponent;
