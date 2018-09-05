import React, {Component} from "react";
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity, Image} from "react-native";

type Props = {};

export enum ImageType {
    user = './../assets/icons/1.png',
    settings = './../assets/icons/2.png',
    anotherOne = './../assets/icons/3.png',
}

class ImageButton extends Component<Props> {

    static defaultProps = {};

    static propTypes = {
        icon: PropTypes.oneOf([ImageType.settings, ImageType.user]),
        clickHandler: PropTypes.func,
    };

    render() {
        return (
            <TouchableOpacity style={styles.button} onPress={this.props.clickHandler}>
                <Image source={require('./../assets/icons/1.png')}/>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#859a9b',
        borderRadius: 20,
        padding: 10,
        marginBottom: 20,
        shadowColor: '#303838',
        shadowOffset: {width: 0, height: 5},
        shadowRadius: 10,
        shadowOpacity: 0.8,
    },
});

export default ImageButton;
