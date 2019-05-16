import React, { Component } from 'react';
import gql from 'graphql-tag'; //helper to write queries
import { graphql } from 'react-apollo';

class SongList extends Component {
    renderSongs() {

        if(this.props.data.loading){return <div>loading...</div>;}

        return this.props.data.songs.map(song=>{
            return (
                <li key={song.id} className="collection-item">
                    {song.title}
                </li>
            );
        });
    }


    render() {
        return (
        <ul className="collection">
            {this.renderSongs()}
        </ul>
        )
    }
}

const query = gql`
    {
        songs{
            id
            title
        } 
    }
`;

export default graphql(query)(SongList);