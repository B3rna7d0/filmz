import { createContext, useContext, useState} from "react";
import {
  IWishlistContextData,
  IMovieProps,
  IWishlistProviderProps,
} from "./types"

const WishlistContext = createContext({} as IWishlistContextData);

export function WishlistProvider(props: IWishlistProviderProps): JSX.Element {
  const [wishlist, setWishlist] = useState<IMovieProps[]>(() => {
    return JSON.parse(localStorage.getItem('wishlist') || '[]')
  });

  function isMovieInWishlist(movieId: number): boolean {
    const movieFound = wishlist.find((wishlistFilm) => wishlistFilm.id === movieId);

    return !!movieFound;
  }
  
  function handleAddOrRemoveMovieOnWishlist(movie: IMovieProps) {
    if (isMovieInWishlist(movie.id)) {
      const filteredWishlist = wishlist.filter((wishlistFilm) => wishlistFilm.id !== movie.id);

      setWishlist(filteredWishlist);

      localStorage.setItem('wishlist', JSON.stringify(filteredWishlist));

      return;
    }

    setWishlist((prevState) => [...prevState, movie]);

    localStorage.setItem('wishlist', JSON.stringify([...wishlist, movie]))
  }

  return (
    <WishlistContext.Provider value={{
      wishlist,
      setWishlist,
      handleAddOrRemoveMovieOnWishlist,
      isMovieInWishlist
    }}>
      {props.children}
    </WishlistContext.Provider>
  )
}

export function useWishlist(): IWishlistContextData {
  const context = useContext(WishlistContext);

  if(!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }

  return context;
}

export default WishlistContext