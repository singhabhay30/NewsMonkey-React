import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: 8,
    category: "general",
  };

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };
  constructor(props) {
    super(props);
    this.state = { articles: [], loading: false, page: 1, totalResults: 0 };
    document.title = `${
      this.props.category.charAt(0).toUpperCase() + this.props.category.slice(1)
    } - NewsMonkey`;
  }

  async updateNews() {
    this.props.setProgress(10);
    this.setState({ loading: true });
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apikey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    let data = await fetch(url);
    this.props.setProgress(730);
    let parsed_data = await data.json();
    this.props.setProgress(70);
    console.log(parsed_data);
    this.setState({
      articles: parsed_data.articles,
      totalarticles: parsed_data.totalResults,
      loading: false,
    });
    this.props.setProgress(100);
    document.title = this.props.category;
  }

  async componentDidMount() {
    this.props.setProgress(10);
    this.setState({ loading: true });
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apikey}&page=1&pageSize=${this.props.pageSize}`;
    let data = await fetch(url);
    this.props.setProgress(30);
    let parsed_data = await data.json();
    this.props.setProgress(70);
    console.log(parsed_data);
    this.setState({
      articles: parsed_data.articles,
      totalarticles: parsed_data.totalResults,
      loading: false,
    });
    this.props.setProgress(100);
    console.log(parsed_data);
  }

  // handleNextClick = async () => {
  //   await this.setState({
  //     page: this.state.page + 1,
  //   });
  //   this.updateNews();
  //   document.body.scrollTop = 0;
  //   document.documentElement.scrollTop = 0;
  // };

  // handlePreviousClick = async () => {
  //   await this.setState({
  //     page: this.state.page - 1,
  //   });
  //   this.updateNews();
  //   document.body.scrollTop = 0;
  //   document.documentElement.scrollTop = 0;
  // };
  fetchMoreData = async () => {
    this.props.setProgress(10);
    this.setState({ page: this.state.page + 1 });
    // this.setState({ loading: true });
    const url = `https://newsapi.org/v2/top-headlines?country=${
      this.props.country
    }&category=${this.props.category}&apiKey=${this.props.apikey}&page=${
      this.state.page + 1
    }&pageSize=${this.props.pageSize}`;
    let data = await fetch(url);
    this.props.setProgress(30);
    let parsed_data = await data.json();
    this.props.setProgress(70);
    this.setState({
      articles: this.state.articles.concat(parsed_data.articles),
      totalResults: parsed_data.totalResults,
      loading: false,
    });
    this.props.setProgress(100);
  };
  render() {
    return (
      <>
        <h1 className="text-center" style={{ margin: "35px 0px" }}>
          NewsMonkey - Top{" "}
          {this.props.category.charAt(0).toUpperCase() +
            this.props.category.slice(1)}{" "}
          Headlines
        </h1>
        {this.state.loading && <Spinner />}

        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<Spinner />}
        >
          <div className="container">
            <div className="row">
              {this.state.articles.map((element) => {
                return (
                  <div className="col-md-4" key={element.url}>
                    <NewsItem
                      title={element.title == null ? "" : element.title}
                      description={
                        element.description == null ? "" : element.description
                      }
                      imageUrl={
                        element.urlToImage == null
                          ? "https://thumbs.dreamstime.com/b/news-newspapers-folded-stacked-word-wooden-block-puzzle-dice-concept-newspaper-media-press-release-42301371.jpg"
                          : element.urlToImage
                      }
                      newsUrl={element.url}
                      author={
                        element.author == null ? "Anonymous" : element.author
                      }
                      date={element.publishedAt}
                      source={element.source.name}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </InfiniteScroll>
        {/* <div className="d-flex justify-content-between">
          <button
            disabled={this.state.page <= 1}
            type="button"
            className="btn btn-dark"
            onClick={this.handlePreviousClick}
          >
            &larr; Previous
          </button>
          <button
            disabled={
              this.state.page + 1 >
              Math.ceil(this.state.totalarticles / this.props.pageSize)
            }
            type="button"
            className="btn btn-dark"
            onClick={this.handleNextClick}
          >
            Next &rarr;
          </button>
        </div> */}
      </>
    );
  }
}

export default News;
