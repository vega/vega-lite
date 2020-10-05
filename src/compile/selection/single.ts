import {SelectionCompiler} from '.';
import {singleOrMultiSignals} from './multi';

const single: SelectionCompiler<'single'> = {
  defined: selCmpt => selCmpt.type === 'single',

  signals: singleOrMultiSignals
};

export default single;
