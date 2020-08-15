import Component from './Component';
import { Board } from '../../BoardBase';
export default interface BoardComponent extends Component {
    board: Board;
}
