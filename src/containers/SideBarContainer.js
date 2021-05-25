import { connect } from "react-redux";
import SideBar from "src/components/SideBar";
import { selectMenuItems, selectSubMenuItems, setActiveIdOfMenuItems, setExpandedOfMenuItem, setActiveIdOfSubMenuItems } from "src/store/slices/menuSlice";
import { removeUser } from "src/store/slices/userSlice";

const mapStateToProps = (state) => ({
    menuItems: selectMenuItems(state),
    subMenuItems: selectSubMenuItems(state),
    user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
    setActiveIdOfMenuItems: (payload) => dispatch(setActiveIdOfMenuItems(payload)),
    setExpandedOfMenuItem: (payload) => dispatch(setExpandedOfMenuItem(payload)),
    setActiveIdOfSubMenuItems: (payload) => dispatch(setActiveIdOfSubMenuItems(payload)),
    removeUser: () => dispatch(removeUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
