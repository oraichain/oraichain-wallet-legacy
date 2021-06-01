import { connect } from "react-redux";
import SendTokens from "src/components/SendTokens";
import { selectUser, removeUser } from "src/store/slices/userSlice";

const mapStateToProps = (state) => ({
    user: selectUser(state)
});

export default connect(mapStateToProps, null)(SendTokens);
