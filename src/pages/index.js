import React from 'react'
import { graphql, Link } from 'gatsby'

import Layout from '../components/Layout'

class Home extends React.Component {
  constructor() {
    super()
    this.state = {
      search: '',
    }
  }

  updateSearch(event) {
    this.setState({ search: event.target.value })
  }

  render() {
    const data = this.props.data

    let filteredSongs = data.allMarkdownRemark.edges.filter(edge => {
      return (
        edge.node.frontmatter.title
          .toLowerCase()
          .indexOf(this.state.search.toLowerCase()) !== -1
      )
    })

    return (
      <Layout>
        <header>
          <div className="container">
            <h1>{filteredSongs.length} Songs</h1>
            <div className="filters">
              <label htmlFor="filter-search">Search:</label>
              <input
                type="text"
                id="filter-search"
                value={this.state.search}
                onChange={this.updateSearch.bind(this)}
              />
            </div>
          </div>
        </header>

        <div className="container">
          <div className="songbook">
            {filteredSongs.map(({ node }) => (
              <div key={node.id} className="song-card">
                <Link to={node.fields.slug}>
                  <span className="song-title">{node.frontmatter.title}</span>
                  <span className="artist">{node.frontmatter.artist}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    )
  }
}

export default Home

export const query = graphql`
  {
    allMarkdownRemark(sort: { fields: [frontmatter___title], order: ASC }) {
      edges {
        node {
          id
          frontmatter {
            title
            artist
          }
          fields {
            slug
          }
        }
      }
    }
  }
`
