import { connect } from "react-redux";
import ConnectWallet from "src/components/ConnectWallet/ConnectWallet";
import { setUser } from "src/store/slices/userSlice";


const mapDispatchToProps = (dispatch) => ({
    setUser: (payload) => dispatch(setUser(payload)),
});

export default connect(null, mapDispatchToProps)(ConnectWallet);
