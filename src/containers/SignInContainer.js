import { connect } from "react-redux";
import SignIn from "src/components/SignIn";
import { selectUser, setUser } from "src/store/slices/userSlice";

const mapStateToProps = (state) => ({
    user: selectUser(state)
});

const mapDispatchToProps = (dispatch) => ({
    setUser: (payload) => dispatch(setUser(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
