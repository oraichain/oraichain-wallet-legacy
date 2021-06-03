import { connect } from "react-redux";
import _ from "lodash";
import NotFound from "src/components/NotFound";
import { selectUser } from "src/store/slices/userSlice";

const mapStateToProps = (state) => {
    const user = selectUser(state);
    const isLoggedIn = !_.isNil(user);
    return {
        isLoggedIn: isLoggedIn,
    };
};

export default connect(mapStateToProps, null)(NotFound);
