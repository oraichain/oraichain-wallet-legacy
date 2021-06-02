import { connect } from "react-redux";
import SetRequest from "src/components/SetRequest";
import { selectUser } from "src/store/slices/userSlice";
import { updateRequestId } from "src/actions";
import { showAlertBox } from "src/store/slices/alertSlice";

const mapStateToProps = (state) => ({
    user: selectUser(state),
});

const mapDispatchToProps = (dispatch) => ({
    updateRequestId: (payload) => dispatch(updateRequestId(payload)),
    showAlertBox: (payload) => dispatch(showAlertBox(payload)),

});

export default connect(mapStateToProps, mapDispatchToProps)(SetRequest);
