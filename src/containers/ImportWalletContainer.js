import { connect } from "react-redux";
import ImportWallet from "src/components/ImportWallet";
import { selectUser } from "src/store/slices/userSlice";

const mapStateToProps = (state) => ({
    user: selectUser(state)
});

export default connect(mapStateToProps, null)(ImportWallet);
