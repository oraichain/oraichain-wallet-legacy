import { connect } from "react-redux";
import AlertBox from "src/components/AlertBox";
import { selectAlert, hideAlertBox } from "src/store/slices/alertSlice";

const mapStateToProps = (state) => {
    const alert = selectAlert(state);
    return {
        visible: alert.visible,
        variant: alert.variant,
        duration: alert.duration,
        message: alert.message,
        onHide: alert.onHide,
    };
};

const mapDispatchToProps = (dispatch) => ({
    hide: () => dispatch(hideAlertBox()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AlertBox);
