import { connect } from "react-redux";
import Auth from "src/components/Auth";
import { selectUser, removeUser } from "src/store/slices/userSlice";

const mapStateToProps = (state) => ({
    user: selectUser(state)
});

const mapDispatchToProps = (dispatch) => ({
    removeUser: (payload) => dispatch(removeUser(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
