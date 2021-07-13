import { connect } from "react-redux";
import Transaction from "src/components/Transaction";
import { showAlertBox } from "src/store/slices/alertSlice";
import { selectUser } from "src/store/slices/userSlice";

const mapStateToProps = (state) => ({
    user: selectUser(state),
});

const mapDispatchToProps = (dispatch) => ({
    showAlertBox: (payload) => dispatch(showAlertBox(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Transaction);
