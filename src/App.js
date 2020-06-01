/* Copyright (c) 2020 Xvezda <xvezda@naver.com>
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import { h, Component, Fragment } from 'preact'
/** @jsx h */

class App extends Component {
  constructor() {
    super()
    const storedState = localStorage.getItem('state')
    this.state = storedState ? JSON.parse(storedState) : {}
  }

  componentDidMount() {
    const options = {
      cache: 'default',
    }

    if (this.state.reset && new Date() < this.state.reset) return

    fetch('https://api.github.com/emojis', options)
      .then(response => {
        const remain = parseInt(response.headers.get('X-RateLimit-Remaining')),
          reset = new Date(response.headers.get('X-Ratelimit-Reset') * 1000);
        this.setState({
          error: false,
          remain: remain,
          reset: reset
        })
        return response.json()
      })
      .then(json => {
        this.setState({
          emojis: json
        })
      })
      .catch(err => {
        console.error(err)
        this.setState({
          error: true,
        })
      })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    localStorage.setItem('state', JSON.stringify(this.state))
  }

  render() {
    return (
      <Fragment>
        <section className="hero">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">GitHub Emojis</h1>
            </div>
          </div>
        </section>
        <div className="container">
          {
            !this.state.error
              ? (
                <div className="tile is-ancestor columns is-multiline">
                  {
                    this.state.emojis
                      && Object.entries(this.state.emojis)
                        .map(([name, imgsrc]) => (
                          <div className="tile is-parent">
                            <div className="tile is-child box">
                              <figure class="image is-16x16">
                                <img src={imgsrc} />
                              </figure>
                            </div>
                          </div>
                    ))
                  }
                </div>
              )
              : (
                <div className="notification is-danger">
                  <p>Failed fetching emojis from API. 😥</p>
                  <p></p>
                </div>
              )
          }
        </div>
      </Fragment>
    )
  }
}

export default App