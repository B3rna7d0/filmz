import { IAppProviderProps } from "../interfaces/AppProvider";
import { GlobalStyles } from "../styles/globals";
import { WishlistProvider } from "./Wishlist";

export function AppProvider(props: IAppProviderProps) {
    return(
        <WishlistProvider>
            <GlobalStyles />

            {props.children}
        </WishlistProvider>
    )
}