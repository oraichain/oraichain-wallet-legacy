import { connect } from "react-redux";
import Security from "src/components/Security";
import { selectUser } from "src/store/slices/userSlice";
import { showAlertBox } from "src/store/slices/alertSlice";

const mapStateToProps = (state) => ({
    user: selectUser(state),
});

const mapDispatchToProps = (dispatch) => ({
    showAlertBox: (payload) => dispatch(showAlertBox(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Security);
