import {SelectionCompiler, TUPLE, unitName} from '.';
import {multiSignals} from './multi';

const single: SelectionCompiler = {
  signals: multiSignals,

  modifyExpr: (model, selCmpt) => {
    const tpl = selCmpt.name + TUPLE;
    return tpl + ', ' + (selCmpt.resolve === 'global' ? 'true' : `{unit: ${unitName(model)}}`);
  }
};

export default single;
