import { connect } from "react-redux";
import _ from "lodash";
import { selectUser } from "src/store/slices/userSlice";
import { Redirect, Route } from "react-router";

const mapStateToProps = (state) => {
    const user = selectUser(state);
    const isLoggedIn = !_.isNil(user);
    return {
        isLoggedIn: isLoggedIn
    };
};

const PrivateRoute = ({ component: Component, isLoggedIn, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(props) =>
                isLoggedIn ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={{ pathname: "/signin", state: { from: props.location } }} />
                )
            }
        />
    );
};

export default connect(mapStateToProps, null)(PrivateRoute);
