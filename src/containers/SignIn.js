import { connect } from "react-redux";
import SignIn from "src/components/SignIn";
import { setUser } from "src/store/slices/userSlice";


const mapDispatchToProps = (dispatch) => ({
    setUser: (payload) => dispatch(setUser(payload)),
});

export default connect(null, mapDispatchToProps)(SignIn);
