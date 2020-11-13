import React from "react";
import { AppContainer } from "../styled-components/Layout";

type Props = {
    children: any,
    // pageTitle: string,
    // description: string,
    // image: string,
    // url: string
}

const Layout: React.FC<Props> = (props): React.ReactElement => {
    return (
        <React.Fragment>
            <AppContainer>
                {props.children}
            </AppContainer>
        </React.Fragment>
    )
}

export default Layout;