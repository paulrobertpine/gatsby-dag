import React from 'react'
import { graphql } from 'gatsby'
import ChordSheetJS from 'chordsheetjs'
import Layout from '../components/Layout'

const Song = ({ data }) => {
  const post = data.markdownRemark
  let formattedSong = post.internal.content

  // remove the frontmatter from the song content
  formattedSong = formattedSong.replace(/---[\S\s]*---/g, '')

  let song = ''
  let youtube = ''

  // check for ChordPro or ChordSheet style (default) formatting. frontmatter has a BOOL flag for ChordPro
  if (post.frontmatter.chordpro) {
    song = new ChordSheetJS.ChordProParser().parse(formattedSong)
  } else {
    song = new ChordSheetJS.ChordSheetParser().parse(formattedSong)
  }

  // check for YouTube vid
  if (post.frontmatter.youtube) {
    // add embed URL
    youtube = 'https://www.youtube.com/embed/' + post.frontmatter.youtube
    console.log(youtube)
    youtube = (
      <div className="youtube">
        <iframe
          title="YouTube"
          width="600"
          height="330"
          src={youtube}
          frameborder="0"
          allow="autoplay; encrypted-media"
          allowfullscreen
        />
      </div>
    )
  }

  // Convert song object into HTML
  const htmlChordSheet = new ChordSheetJS.HtmlDivFormatter().format(song)

  return (
    <Layout>
      <header>
        <div className="container">
          <h1>{post.frontmatter.title}</h1>
          <h2>{post.frontmatter.artist}</h2>
          <h3>key of {post.frontmatter.key}</h3>
        </div>
      </header>

      <div
        className="song"
        dangerouslySetInnerHTML={{ __html: htmlChordSheet }}
      />

      {youtube}
    </Layout>
  )
}

export default Song

export const query = graphql`
  query SongQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
        artist
        key
        chordpro
        youtube
      }
      internal {
        content
      }
    }
  }
`
