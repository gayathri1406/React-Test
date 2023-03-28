import React, { Component } from 'react';
import axios from 'axios';
import searchIcon from "./Icons/search.svg"
import sortIcon from "./Icons/sort.png"
import InfiniteScroll from 'react-infinite-scroll-component';


class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            defaultList: [],
            view: "grid",
            searchTxt: "",
            sortList: ['def', 'asc', 'des'],
            sortIndex: 0,
            urlList: ["http://run.mocky.io/v3/6f7a76ed-d6f5-4b54-be23-bf9a141c982a", "http://run.mocky.io/v3/07316365-b8d2-4574-9bc1-22b17b054e3b", "http://run.mocky.io/v3/1c56213e-1191-4b47-a54f-066736165ff3"],
            urlIndex: 0,
        }

    }

    componentDidMount() {
        this.getList()
    }

    getList = () => {
        let { urlIndex, urlList, list, defaultList } = this.state;
        axios.get(urlList[urlIndex]).then((response) => {
            this.setState({ list: list.concat(response.data), defaultList: defaultList.concat(response.data) }
            );
        })
    }

    handleSearch = (e) => {
        this.setState({ searchTxt: e.target.value });
        let arr = this.state.defaultList.filter((item) =>
        (
            item.name
                .toString()
                .toLowerCase()
                .indexOf(e.target.value.toLowerCase()) > -1
        )
        );
        this.setState({ list: arr })
    }

    viewChange = (view) => {
        this.setState({ view })
    }

    sortTable = () => {
        let { defaultList, sortIndex, sortList } = this.state;
        let sortedList = [...defaultList];
        sortIndex = (sortIndex + 1) % sortList.length
        if (sortList[sortIndex] === "asc") {
            sortedList = sortedList.sort((a, b) => (a.name > b.name) ? 1 : -1);
        } else if (sortList[sortIndex] === "des") {
            sortedList = sortedList.sort((a, b) => (a.name > b.name) ? -1 : 1);
        }
        this.setState({ list: sortedList, sortIndex })
    }

    fetchMoreData = () => {
        setTimeout(() => {
            let { urlIndex, list } = this.state
            urlIndex = (urlIndex + 1) % this.state.urlList.length
            let slicesArr = [...list];
            this.setState({ urlIndex }, () => {
                this.getList();
            })
        }, 1500);
    };

    render() {
        let { list, view, searchTxt } = this.state;
        return (
            <div className='fullBor'>
                <div className='viewTitle'>{view === "table" ? "Table View" : "Grid View"}</div>
                <div className='flex mb-20 mt-30 pad025'>
                    <div className='searchBox'>
                        <input type="text" onChange={this.handleSearch} value={searchTxt} name="searchTxt" placeholder='Search' className='searchtxt' onKey />
                        <img src={searchIcon} width="20px" height="20px" className='searchIcon' />
                    </div>
                    <div className='flex '>
                        <div className={view === "grid" ? 'mr-10 point cl0A8080 fw-700 f16' : "mr-10 point f16 fw-700"} onClick={() => this.viewChange("grid")} >Grid View</div> |
                        <div className={view === "table" ? "ml-10 point cl0A8080 fw-700 f16" : 'ml-10 point f16 fw-700'} onClick={() => this.viewChange("table")}>Table View</div>
                    </div>
                </div>
                {view === "grid" ?
                    <InfiniteScroll dataLength={this.state.list.length}
                        next={this.fetchMoreData}
                        hasMore={true}
                        loader={
                            <div className='flexMid'>
                                <h2 className={searchTxt.length > 0 ? "disnone" : "disblock pad025"}>Loading...</h2>
                            </div>}

                    >


                        <div className='gridView pad25'>
                            {list.map((item, i) => (
                                <div className='listBox' key={i}>
                                    <img src={item.image} width="100px" height="100px" className='mb-15 br-5' />
                                    <div className='mb-15 fw-600'>
                                        {item.name}
                                    </div>
                                    <div className='txtcen'>{item.description}</div>
                                </div>
                            ))}
                        </div>
                    </InfiniteScroll>

                    :

                    <InfiniteScroll
                        dataLength={this.state.list.length}
                        next={this.fetchMoreData}
                        hasMore={true}
                        loader={
                            <div className='flexMid'>
                                <h2 className={searchTxt.length > 0 ? "disnone" : "disblock pad025"}>Loading...</h2>
                            </div>}
                    >
                        <div className='fixTableHead'>
                            <table className='fixed_headers'>
                                <thead>
                                    <tr>
                                        <th className='w10'>Image</th>
                                        <th className='w20 ' onClick={() => this.sortTable()}>
                                            <div className='flexStart'>

                                                <p>Name</p>
                                                <img src={sortIcon} width="15px" height="15px" />
                                            </div>
                                        </th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {list.map((item) => (
                                        <tr className='trowBor'>
                                            <td className='pad15 alignCenter'>
                                                <img src={item.image} width="100px" height="100px" className='br-5' />
                                            </td>
                                            <td className=''>{item.name}  </td>
                                            <td className=''>{item.description}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </InfiniteScroll>
                }
            </div>
        );
    }
}

export default List;