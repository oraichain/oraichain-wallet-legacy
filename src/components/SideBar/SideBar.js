import React from "react";
import { useHistory } from "react-router-dom";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import _ from "lodash";
import DownAngleIcon from "src/components/icons/DownAngleIcon";
import UpAngleIcon from "src/components/icons/UpAngleIcon";
import LogoutIcon from "src/components/icons/LogoutIcon";
import styles from "./SideBar.module.scss";
const cx = cn.bind(styles);

const SideBar = ({ menuItems, subMenuItems, setActiveIdOfMenuItems, setExpandedOfMenuItem, setActiveIdOfSubMenuItems }) => {
    const history = useHistory();
    const pathname = history.location.pathname;
    const menuItemUrls = Object.values(menuItems.byId).filter(menuItem => !_.isNil(menuItem?.url)).map(menuItem => menuItem.url);
    const subMenuItemUrls = Object.values(subMenuItems.byId).filter(subMenuItem => !_.isNil(subMenuItem?.url)).map(subMenuItem => subMenuItem.url);

    if (menuItemUrls.includes(pathname)) {
        const activeMenuItem = Object.values(menuItems.byId).find(menuItem => menuItem?.url === pathname);
        if (activeMenuItem.id !== menuItems.activeId) {
            setActiveIdOfMenuItems(activeMenuItem.id);
            setActiveIdOfSubMenuItems(null);
        }
    } else if (subMenuItemUrls.includes(pathname)) {
        const activeSubMenuItem = Object.values(subMenuItems.byId).find(subMenuItem => subMenuItem?.url === pathname);
        if (activeSubMenuItem.id !== subMenuItems.activeId) {
            const parentMenuItem = Object.values(menuItems.byId).find(menuItem => Array.isArray(menuItem?.subMenuItemIds) &&  menuItem.subMenuItemIds.includes(activeSubMenuItem.id));
            if (parentMenuItem) {
                setExpandedOfMenuItem({
                    menuItemId: parentMenuItem.id,
                    expanded: true,
                });
            }
            setActiveIdOfMenuItems(null);
            setActiveIdOfSubMenuItems(activeSubMenuItem.id);
        }
    }

    return (
        <div className={cx("side-bar")}>
            <div className={cx("menu")}>
                {
                    Object.values(menuItems.byId).map((menuItem) => {
                        const hasSubMenu = Array.isArray(menuItem?.subMenuItemIds) ? true : false;

                        let expandedElement;
                        let subMenuElement;

                        if (hasSubMenu) {
                            if (menuItem.expanded) {
                                expandedElement = (
                                    <>
                                        <div className={cx("menu-item-expanded", "menu-item-expanded-true")} onClick={() => {
                                            setExpandedOfMenuItem({
                                                menuItemId: menuItem.id,
                                                expanded: false
                                            })
                                        }}>
                                            <UpAngleIcon className={cx("menu-item-expanded-icon")} />
                                        </div>
                                    </>
                                );

                                subMenuElement = (<div className={cx("sub-menu")}>
                                    {
                                        menuItem.subMenuItemIds.map((subMenuItemId) => {
                                            return <div className={cx("sub-menu-item", { "sub-menu-item-active": subMenuItemId === subMenuItems.activeId })} onClick={() => {
                                                setActiveIdOfSubMenuItems(subMenuItemId);
                                                setActiveIdOfMenuItems(null);
                                                if (!_.isNil(subMenuItems?.byId?.[subMenuItemId]?.url)) {
                                                    history.push(subMenuItems.byId[subMenuItemId].url);
                                                }
                                            }}>{subMenuItems.byId[subMenuItemId].text}</div>
                                        })
                                    }
                                </div>);
                            } else {
                                expandedElement = (
                                    <div className={cx("menu-item-expanded", "menu-item-expanded-false")} onClick={() => {
                                        setExpandedOfMenuItem({
                                            menuItemId: menuItem.id,
                                            expanded: true
                                        })
                                    }}>
                                        <DownAngleIcon className={cx("menu-item-expanded-icon")} />
                                    </div>
                                )
                                subMenuElement = <></>;
                            }
                        } else {
                            expandedElement = <></>;
                            subMenuElement = <></>;
                        }

                        let isActiveMenuItem = false;
                        if (!_.isNil(subMenuItems.activeId)) {
                            if (Array.isArray(menuItem.subMenuItemIds) && menuItem.subMenuItemIds.includes(subMenuItems.activeId)) {
                                isActiveMenuItem = true;
                            }
                        } else {
                            if (menuItem.id === menuItems.activeId) {
                                isActiveMenuItem = true;
                            }
                        }

                        return (
                            <div className={cx("menu-item")}>
                                <div className={cx("menu-item-self")}>
                                    <div className={cx("menu-item-info")}>
                                        <div className={cx("menu-item-icon")}>
                                            {isActiveMenuItem ? menuItem.activeIcon : menuItem.icon}
                                        </div>
                                        <div className={cx("menu-item-text", { "menu-item-text-active": isActiveMenuItem })} onClick={() => {
                                            if (!hasSubMenu) {
                                                setActiveIdOfMenuItems(menuItem.id);
                                                setActiveIdOfSubMenuItems(null);
                                                if (!_.isNil(menuItem?.url)) {
                                                    history.push(menuItem.url);
                                                }
                                            }
                                        }}>
                                            {menuItem.text}
                                        </div>
                                    </div>

                                    {expandedElement}
                                </div>

                                {
                                    subMenuElement
                                }
                            </div>
                        );
                    })
                }

            </div>
            <div className={cx("logout")}>
                <LogoutIcon className={cx("logout-icon")} />
                <span className={cx("logout-text")}>Log out</span>
            </div>
        </div>

    );
};

SideBar.propTypes = {
    menuItems: PropTypes.any,
    subMenuItems: PropTypes.any,
    setActiveIdOfMenuItems: PropTypes.func,
    setExpandedOfMenuItem: PropTypes.func,
    setActiveIdOfSubMenuItems: PropTypes.func,
};
SideBar.defaultProps = {};

export default SideBar;
