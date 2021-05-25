import { connect } from "react-redux";
import NavBar from "src/components/NavBar";
import { selectUser } from "src/store/slices/userSlice";


const mapStateToProps = (state) => ({
    user: selectUser(state),
});

export default connect(mapStateToProps, null)(NavBar);
