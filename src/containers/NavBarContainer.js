import { connect } from "react-redux";
import NavBar from "src/components/NavBar";
import { selectUser, removeUser } from "src/store/slices/userSlice";


const mapStateToProps = (state) => ({
    user: selectUser(state),
});

const mapDispatchToProps = (dispatch) => ({
    removeUser: () => dispatch(removeUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
