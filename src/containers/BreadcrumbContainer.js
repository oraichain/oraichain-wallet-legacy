import { connect } from "react-redux";
import Breadcrumb from "src/components/Breadcrumb";
import { selectMenuItems, selectSubMenuItems } from "src/store/slices/menuSlice";

const mapStateToProps = (state) => ({
    menuItems: selectMenuItems(state),
    subMenuItems: selectSubMenuItems(state),
});

export default connect(mapStateToProps)(Breadcrumb);
