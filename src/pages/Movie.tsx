import { FiCameraOff, FiCheck, FiLink, FiPlus } from 'react-icons/fi';
import { Button } from '../components/Button';
import { ButtonVariants } from '../components/Button/types';
import * as Styles from '../styles/pages/Movie';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { IMovieRequestProps } from '../interfaces/movie';
import { Loading } from "../components/Loading";
import { useWishlist } from '../hooks/Wishlist';


export function Movie() {
  const { isMovieInWishlist, handleAddOrRemoveMovieOnWishlist } = useWishlist();

    const { id } = useParams();

    const [isLoading, setIsLoading] = useState(true);
    const [movie, setMovie] = useState<IMovieRequestProps>({} as IMovieRequestProps);

    const currentUrl = window.location.href;

    const movieYearRelease = movie && new Date(movie.release_data).getFullYear();
    const movieHours = movie && Number(Math.trunc(movie.runtime / 60).toFixed(0));
    const movieMinutes = movie && movieHours && (movie.runtime - movieHours * 60).toFixed(0);
     
    const [isLinkCopiedToClipboard, setIsLinkCopiedToClipBoard] = useState(false);

    function handleCopyLinkToClipboard() {
      setIsLinkCopiedToClipBoard(true);

      navigator.clipboard.writeText(currentUrl);
    }

    useEffect(()  => {
     if  (isLinkCopiedToClipboard){
      setTimeout(() => {
        setIsLinkCopiedToClipBoard(false);
      }, 2500);
     }
    }, [isLinkCopiedToClipboard]);

    useEffect(() => {
      api.get<IMovieRequestProps>(`/movie/${id}`).then((response) => {
        setMovie(response.data);
      }).finally(() => {
          setIsLoading(false);
      });
    }, []);
 
    return (
        <Styles.Container>
          {isLoading ? (
            <div className='loading-wrapper'>
              <Loading />
            </div>
          ) : (
        <section id='presentation'>
           <div className='movie-poster-wrapper'>
            {movie?.poster_path ? (
              <a href={movie?.homepage} target='_blank'>
               <img src={`${import.meta.env.VITE_THE_MOVIE_DB_IMAGES_URL}${movie?.poster_path}`} 
               alt={`Capa do filme ${movie?.title}`} />
              </a>
            ) : (
                <>
                <FiCameraOff />
                <p>Capa indisponível</p>
                </>
            )}
         </div>

        <div className='about'>
         <div>
          <a href={movie?.homepage} target='_blank'>
            <h1>{movie?.title}</h1>
          </a>
    
          
          <h4> 
          {movie?.genres.map((genre) => genre.name).toString().replaceAll(',', ', ')}
          <span>•</span>
          {movieYearRelease}
          <span>•</span>
          {`${movieHours}h `}
          {movieMinutes}m
          </h4>

          <p>{movie?.overview}</p>
        </div>
    
    <footer>
        <p>Avaliação geral: <span>{movie?.vote_average.toFixed(1)}</span></p>
        <p>
          Número de votos: <span>{movie?.vote_count}</span>
        </p>
        <div className='actions'>
          <Button
          variant={ButtonVariants.Secondary} 
          onClick={handleCopyLinkToClipboard}
          disabled={isLinkCopiedToClipboard}
          >
            {isLinkCopiedToClipboard ? (
              <>
              Link copiado
              <FiCheck />
              </>
            ) : (
            <>
            Copiar link
            <FiLink />
            </>
            )}
          </Button>

          <Button 
            type='button' 
            variant={ButtonVariants.Secondary}
            onClick={() => handleAddOrRemoveMovieOnWishlist(movie)}
            >
            {isMovieInWishlist(movie.id) ? (
              <>
                Em sua lista
                <FiCheck />
              </>
            ) : (
            <>         
            Adicionar à minha lista
            <FiPlus />
            </> 
            )}
          </Button>
        </div>
       </footer>
     </div>
    </section>
  ) }
    </Styles.Container>

    )
}