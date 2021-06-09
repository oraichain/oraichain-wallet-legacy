import { connect } from "react-redux";
import GetRequest from "src/components/GetRequest";
import { selectUser } from "src/store/slices/userSlice";
import { showAlertBox } from "src/store/slices/alertSlice";

const mapStateToProps = (state) => ({
    user: selectUser(state),
});

const mapDispatchToProps = (dispatch) => ({
    showAlertBox: (payload) => dispatch(showAlertBox(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GetRequest);
