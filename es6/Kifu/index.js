import Kifu from "./Kifu";
import KNode from "./KNode";
import KifuError from "./KifuError";
import * as properties from "./properties";
import {markupProperties} from "./propertyGroups";
import propertyValueTypes from "./propertyValueTypes";

Kifu.KNode = KNode;
Kifu.KifuError = KifuError;
Kifu.markupProperties = markupProperties;
Kifu.properties = properties;
Kifu.propertyValueTypes = propertyValueTypes;

export default Kifu;
export {KNode, KifuError, markupProperties, properties, propertyValueTypes};
