import React from 'react';
import { withRouter } from "react-router";
import { ChevronRight, ExpandMore } from '@mui/icons-material';
import { Treebeard, decorators } from 'react-treebeard';
import EnumTypeIcon from './EnumTypeIcon';
import nbsp from '../nbsp';
import { withTreeViewSelect } from './TreeViewSelectContext';
import { withStyles } from '@mui/styles';
import ContextMenu from '../ContextMenu/ContextMenu';

const nodeSizeStyle = {
    height: 16,
    width: 16
}

Treebeard.defaultProps = {
    style: {
        tree: {
            base: {
                listStyle: 'none',
                backgroundColor: 'transparent',
                margin: '10px 0px',
                padding: 0,
                color: 'rgba(0, 0, 0, 0.87)',
                fontSize: '16px'
            },
            node: {
                base: {
                    position: 'relative'
                },
                link: {
                    cursor: 'pointer',
                    position: 'relative',
                    padding: '0px 16px',
                    display: 'flex',
                    alignItems: 'center'
                },
                container: {
                    cursor: 'pointer',
                    position: 'relative',
                    padding: '0px 16px',
                    display: 'flex',
                    alignItems: 'center'
                },
                activeLink: {
                    background: 'transparent'
                },
                toggle: {
                    base: {
                        position: 'relative',
                        display: 'inline-block',
                        verticalAlign: 'top',
                        marginLeft: '-5px',
                        ...nodeSizeStyle
                    },
                    wrapper: {
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        margin: '-7px 0 0 -7px',
                        height: '14px'
                    },
                    height: 14,
                    width: 14,
                    arrow: {
                        fill: '#9DA5AB',
                        strokeWidth: 0
                    }
                },
                header: {
                    base: {
                        verticalAlign: 'top',
                        color: 'rgba(0, 0, 0, 0.87)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        flex: 1
                    },
                    connector: {
                        width: '2px',
                        height: '12px',
                        borderLeft: 'solid 2px black',
                        borderBottom: 'solid 2px black',
                        position: 'absolute',
                        top: '0px',
                        left: '-21px'
                    },
                    title: {
                        lineHeight: '24px',
                        verticalAlign: 'middle'
                    }
                },
                subtree: {
                    listStyle: 'none',
                    paddingLeft: 4,
                    marginLeft: 8
                },
                loading: {
                    color: '#E2C089'
                }
            }
        }
    }
}

const NodeName = withStyles({
    'root': {
        'whiteSpace': 'nowrap',
        'textOverflow': 'ellipsis',
        'overflow': 'hidden',
        'fontSize': 14
    }
}, { name: 'NodeName' })(({ children, classes }) => (
    <span className={classes.root}>{children}</span>
));

class TreeView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.onToggle = this.onToggle.bind(this);
        this.isToggledTree = this.isToggledTree.bind(this);
        this.isNodeSelected = this.isNodeSelected.bind(this);
    }

    onToggle(node, toggled) {
        if (this.state.cursor) {
            this.setState({ cursor: { active: false } })
        }
        node.active = true;
        if (node.children) { node.toggled = toggled; }
        this.setState({ cursor: node });
    }

    isToggledTree(node) {
        const children = node.children;
        Object.assign(node, { toggled: this.isNodeSelected(node) });
        if (Array.isArray(children)) {
            for (var i = 0; i < children.length; i++) {
                const child = children[i];
                this.isToggledTree(child);
            }
        }
        return node;
    }

    /**
     * 
     * @param {{id:string,routes?:string[]}} node
     */
    isNodeSelected({ id, name, routes }) {
        const { getItem } = this.props;
        const selectedItem = getItem();
        return selectedItem !== null && id === selectedItem;
    }

    render() {
        const { tree, onNodeClick } = this.props;
        if (!tree) return null;
        const myDecorators = {
            ...decorators,
            Header: ({ style, node, onDoubleClick, onNodeClick }) => {
                return (
                    <div style={style.base} onDoubleClick={() => onDoubleClick()} onClick={() => onNodeClick(node)}>
                        <div id={node.id} style={{ display: 'flex', alignItems: 'center' }}>
                            <EnumTypeIcon type={node.type} />
                            <NodeName>{node.name}</NodeName>
                        </div>
                    </div>
                );
            },
            Toggle: ({ onClick, node }) => {
                const content = !!node.toggled ? <ExpandMore /> : <ChevronRight />;
                return <div style={nodeSizeStyle} onClick={onClick}>{content}</div>;
            },
            Container: withStyles({
                'container': {
                    '&:hover': {
                        backgroundColor: '#dfdfdf'
                    },
                    height: 20
                }
            }, { name: 'TreeView-Container' })(({ node, decorators, onClick, style, classes }) => {
                const { Header, Toggle } = decorators;
                const { children } = node;
                var ContainerStyle = {};
                Object.assign(ContainerStyle, style.container, this.isNodeSelected(node) ? { backgroundColor: '#cfebff', fontWeight: 600 } : {});
                if (node.contextMenu) {
                    Object.assign(ContainerStyle, { cursor: 'context-menu' });
                }
                return (
                    node.contextMenu ? (
                        <ContextMenu {...node.contextMenu}>
                            <div className={classes.container} style={ContainerStyle} >
                                {Array.isArray(children) && children.length > 0 ? <Toggle node={node} onClick={onClick} /> : <div style={nodeSizeStyle} >{nbsp}</div>}
                                <Header node={node} style={style.header} onDoubleClick={onClick} onNodeClick={onNodeClick} />
                            </div >
                        </ContextMenu>
                    ) : (
                            <div className={classes.container} style={ContainerStyle} >
                                {Array.isArray(children) && children.length > 0 ? <Toggle node={node} onClick={onClick} /> : <div style={nodeSizeStyle} >{nbsp}</div>}
                                <Header node={node} style={style.header} onDoubleClick={onClick} onNodeClick={onNodeClick} />
                            </div >
                        )
                );
            })
        }

        return (
            <Treebeard
                style={this.props.style}
                data={tree}
                decorators={myDecorators}
                onToggle={this.onToggle}
                animations={false}
            />
        );
    }
}

export default withRouter(withTreeViewSelect(TreeView));