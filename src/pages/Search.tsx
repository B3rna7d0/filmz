import { useEffect, useState } from "react";
import api from "../services/api";
import { useSearchParams } from "react-router-dom";
import * as Styles from "../styles/pages/Search";
import { Loading } from "../components/Loading";
import { MovieCard } from "../components/MovieCard";
import { useWishlist } from "../hooks/Wishlist";
import { IMovieRequestProps } from "../interfaces/movie";

export function Search() {
    const {isMovieInWishlist, handleAddOrRemoveMovieOnWishlist} = useWishlist();

    const [isLoading, setIsLoading] = useState(true);
    const [keyword] = useSearchParams();
    
    const [movies, setMovies] = useState<IMovieRequestProps[]>([])

    useEffect(() => {
        api.get('/search/movie', {
            params: {
                query: keyword.get('keyword'),
                include_adults: false,
            }
        }).then((response) => {
            setMovies(response.data.results)
        }).finally(() => {
            setIsLoading(false);
        })
        , [keyword.get('keyword')]})


    return (
        <Styles.Container>
            <section id="movies">
                <h3>{movies.length} resultado{movies.length > 1 ? 's' : ''} 
                encontrados {movies.length > 1 ? 's' : ''}</h3>

                <div className="cards">
                    {isLoading ? (
                        <Loading />
                    ) : (movies.map((movie) => (            
                        <MovieCard
                        key={movie?.id}
                        movie={movie}
                        inWishlist={isMovieInWishlist(movie.id)}
                        handleAddMovieOnWishlist={() => handleAddOrRemoveMovieOnWishlist(movie)}
                        className="card"
                        />
                    )))
                    }
                </div>
            </section>
        </Styles.Container>
    )
}