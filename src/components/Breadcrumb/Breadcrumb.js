import React from "react";
import { NavLink } from "react-router-dom";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import _ from "lodash";
import styles from "./Breadcrumb.module.scss";
const cx = cn.bind(styles);

const Breadcrumb = ({menuItems, subMenuItems}) => {
    let data = [
        {
            url: "/",
            text: "Home",
        }
    ];

    if (!_.isNil(subMenuItems.activeId)) {
        const activeSubMenuItem = subMenuItems.byId[subMenuItems.activeId];
        const parentMenuItem = Object.values(menuItems.byId).find(menuItem => Array.isArray(menuItem?.subMenuItemIds) && menuItem.subMenuItemIds.includes(activeSubMenuItem.id));
        data.push({
            url: parentMenuItem?.url ?? null,
            text: parentMenuItem?.text ?? "",
        });
        data.push({
            url: activeSubMenuItem?.url ?? null,
            text: activeSubMenuItem?.text ?? "",
        })
    } else if (!_.isNil(menuItems.activeId)) {
        const activeMenuItem = menuItems.byId[menuItems.activeId];
        data.push({
            url: activeMenuItem?.url ?? null,
            text: activeMenuItem?.text ?? "",
        })
    }

    return (
        <nav aria-label="breadcrumb" className={cx("breadcrumb-wrapper")}>
            <ol class="breadcrumb">
                {
                    data.map((item, index) => {
                        return (
                            <li className="breadcrumb-item" key={"breadcrumb-item-" + index}>
                                {
                                    _.isNil(item?.url) ? (
                                        <span className={cx("breadcrumb-text", { "breadcrumb-text-active": index === data.length - 1 })}>{item?.text ?? ""}</span>
                                    ) : (
                                        <NavLink className={cx("breadcrumb-link", { "breadcrumb-link-active": index === data.length - 1 })} to={item.url}>{item?.text ?? ""}</NavLink>
                                    )
                                }
                            </li>
                        );
                    })
                }
            </ol>
        </nav>
    );
};

Breadcrumb.propTypes = {
    menuItems: PropTypes.any,
    subMenuItems: PropTypes.any,
};
Breadcrumb.defaultProps = {};

export default Breadcrumb;
