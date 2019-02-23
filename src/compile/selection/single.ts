import {multiSignals} from './multi';
import {SelectionCompiler, TUPLE, unitName} from './selection';

const single: SelectionCompiler<'single'> = {
  signals: multiSignals,

  modifyExpr: (model, selCmpt) => {
    const tpl = selCmpt.name + TUPLE;
    return tpl + ', ' + (selCmpt.resolve === 'global' ? 'true' : `{unit: ${unitName(model)}}`);
  }
};

export default single;
