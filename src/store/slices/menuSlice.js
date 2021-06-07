import { createSlice } from "@reduxjs/toolkit";
import DocumentIcon from "src/components/icons/DocumentIcon";
import ActiveDocumentIcon from "src/components/icons/ActiveDocumentIcon";
import GraphIcon from "src/components/icons/GraphIcon";
import ActiveGraphIcon from "src/components/icons/ActiveGraphIcon";
import ChartIcon from "src/components/icons/ChartIcon";
import ActiveChartIcon from "src/components/icons/ActiveChartIcon";
import SettingIcon from "src/components/icons/SettingIcon";
import ActiveSettingIcon from "src/components/icons/ActiveSettingIcon";

export const menuItemIds = {
    INTERACT_WASM_CONTRACT: 1,
    SEND_TOKENS: 2,
    INTERACT_WITH_PROVIDER_SCRIPTS: 3,
    INTERACT_WITH_AI_REQUEST: 4,
};

export const subMenuItemIds = {
    QUERY: 1,
    EXECUTE: 2,
    DEPLOY: 3,
    SET_PROVIDER_SCRIPTS: 4,
    EDIT_PROVIDER_SCRIPTS: 5,
    SET_REQUEST: 6,
    GET_REQUEST: 7,
}

export const menuSlice = createSlice({
    name: "menu",
    initialState: {
        menuItems: {
            byId: {
                // [menuItemIds.INTERACT_WASM_CONTRACT]: {
                //     id: menuItemIds.INTERACT_WASM_CONTRACT,
                //     icon: <DocumentIcon />,
                //     activeIcon: <ActiveDocumentIcon />,
                //     text: "Interact Wasm Contract",
                //     expanded: false,
                //     subMenuItemIds: [subMenuItemIds.QUERY, subMenuItemIds.EXECUTE, subMenuItemIds.DEPLOY],
                // },
                [menuItemIds.SEND_TOKENS]: {
                    id: menuItemIds.SEND_TOKENS,
                    icon: <GraphIcon />,
                    activeIcon: <ActiveGraphIcon />,
                    text: "Send Tokens",
                    url: "/send-tokens",
                },
                // [menuItemIds.INTERACT_WITH_PROVIDER_SCRIPTS]: {
                //     id: menuItemIds.INTERACT_WITH_PROVIDER_SCRIPTS,
                //     icon: <ChartIcon />,
                //     activeIcon: <ActiveChartIcon />,
                //     text: "Interact with Provider scripts",
                //     expanded: false,
                //     subMenuItemIds: [subMenuItemIds.SET_PROVIDER_SCRIPTS, subMenuItemIds.EDIT_PROVIDER_SCRIPTS]
                // },
                // [menuItemIds.INTERACT_WITH_AI_REQUEST]: {
                //     id: menuItemIds.INTERACT_WITH_AI_REQUEST,
                //     icon: <SettingIcon />,
                //     activeIcon: <ActiveSettingIcon />,
                //     text: "Interact with ai request",
                //     expanded: false,
                //     subMenuItemIds: [subMenuItemIds.SET_REQUEST, subMenuItemIds.GET_REQUEST],
                // }
            },
            allIds: Object.values(menuItemIds),
            activeId: null,
        },
        subMenuItems: {
            byId: {
                [subMenuItemIds.QUERY]: {
                    id: subMenuItemIds.QUERY,
                    text: "Query",
                    url: "/wasm_contract/query",
                },
                [subMenuItemIds.EXECUTE]: {
                    id: subMenuItemIds.EXECUTE,
                    text: "Execute",
                    url: "/wasm_contract/execute",
                },
                [subMenuItemIds.DEPLOY]: {
                    id: subMenuItemIds.DEPLOY,
                    text: "Deploy",
                    url: "/wasm_contract/deploy",
                },
                // [subMenuItemIds.SET_PROVIDER_SCRIPTS]: {
                //     id: subMenuItemIds.SET_PROVIDER_SCRIPTS,
                //     text: "Set Provider Scripts",
                //     url: "/provider_scripts/set",
                // },
                // [subMenuItemIds.EDIT_PROVIDER_SCRIPTS]: {
                //     id: subMenuItemIds.EDIT_PROVIDER_SCRIPTS,
                //     text: "Edit Provider Scripts",
                //     url: "/provider_scripts/edit",
                // },
                [subMenuItemIds.SET_REQUEST]: {
                    id: subMenuItemIds.SET_REQUEST,
                    text: "Set Request",
                    url: "/ai_request/set",
                },
                [subMenuItemIds.GET_REQUEST]: {
                    id: subMenuItemIds.GET_REQUEST,
                    text: "Get Request",
                    url: "/ai_request/get",
                },
            },
            allIds: Object.values(subMenuItemIds),
            activeId: null,
        },
    },
    reducers: {
        setActiveIdOfMenuItems: (state, action) => {
            state.menuItems.activeId = action.payload;
        },
        setExpandedOfMenuItem: (state, action) => {
            state.menuItems.byId[action.payload.menuItemId].expanded = action.payload.expanded;
        },
        setActiveIdOfSubMenuItems: (state, action) => {
            state.subMenuItems.activeId = action.payload;
        },
    },
});

export const { setActiveIdOfMenuItems, setExpandedOfMenuItem, setActiveIdOfSubMenuItems } = menuSlice.actions;

export const selectMenuItems = (state) => {
    return state.menu.menuItems;
};

export const selectSubMenuItems = (state) => {
    return state.menu.subMenuItems;
};

export default menuSlice.reducer;
