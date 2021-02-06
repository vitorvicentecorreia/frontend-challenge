import React from 'react'

import { ArtistIntro, Card } from 'components'
import { SomosClient } from 'utils'

import styles from './Artist.module.css'
import cardStyles from 'components/Card/Card.module.css'

export default function Artist({ match }) {
  const [artist, setArtist] = React.useState()
  const [albums, setAlbums] = React.useState()

  const api = React.useMemo(() => new SomosClient(), [])
  const artistId = React.useMemo(() => match.params.id, [])
  const formattedReleaseDate = React.useCallback(release_date => {
    const [year, month, day] = release_date.split('-')
    return `${day}/${month}/${year}`
  }, [])

  const getArtist = React.useCallback(async () => {
    const response = await api.getArtist(artistId)
    setArtist({ ...response, photograph: response.images[2].url })
  }, [])

  const getAlbums = React.useCallback(async () => {
    const response = await api.getArtistAlbums(artistId)
    setAlbums(response.items)
  }, [])

  React.useEffect(() => {
    getArtist()
  }, [])

  React.useEffect(() => {
    if (artist) getAlbums(artistId)
  }, [artist])

  return (
    <div className={styles.artist}>
      <div className={styles.artistIntro}>
        <ArtistIntro artist={artist} />
      </div>
      <h2 className={cardStyles.listTitle}>Albuns</h2>
      {albums && (
        <div className={cardStyles.list}>
          {albums.map(album => (
            <div className={cardStyles.listItem}>
              <Card key={album.id} img={album.images[1].url}>
                <span>{album.name}</span>
                <span>{formattedReleaseDate(album.release_date)}</span>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
