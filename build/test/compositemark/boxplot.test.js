/* tslint:disable:quotemark */
import { assert } from 'chai';
import * as log from '../../src/log';
import { normalize } from '../../src/spec';
import { defaultConfig } from '.././../src/config';
describe('normalizeBoxMinMax', function () {
    it('should produce an error if both axes have aggregate boxplot', function () {
        assert.throws(function () {
            normalize({
                description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
                data: { url: 'data/population.json' },
                mark: {
                    type: 'boxplot',
                    extent: 'min-max'
                },
                encoding: {
                    x: { aggregate: 'boxplot', field: 'people', type: 'quantitative' },
                    y: {
                        aggregate: 'boxplot',
                        field: 'people',
                        type: 'quantitative',
                        axis: { title: 'population' }
                    },
                    color: { value: 'skyblue' }
                }
            }, defaultConfig);
        }, Error, 'Both x and y cannot have aggregate');
    });
    it('should produce correct layered specs for vertical boxplot with two quantitative axes and use default orientation', function () {
        assert.deepEqual(normalize({
            description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
            data: { url: 'data/population.json' },
            mark: {
                type: 'boxplot',
                extent: 'min-max',
                size: 5
            },
            encoding: {
                x: { field: 'age', type: 'quantitative' },
                y: {
                    field: 'people',
                    type: 'quantitative',
                    axis: { title: 'population' }
                },
                color: { value: 'skyblue' }
            }
        }, defaultConfig), {
            description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
            data: { url: 'data/population.json' },
            transform: [
                {
                    aggregate: [
                        {
                            op: 'q1',
                            field: 'people',
                            as: 'lower_box_people'
                        },
                        {
                            op: 'q3',
                            field: 'people',
                            as: 'upper_box_people'
                        },
                        {
                            op: 'median',
                            field: 'people',
                            as: 'mid_box_people'
                        },
                        {
                            op: 'min',
                            field: 'people',
                            as: 'lower_whisker_people'
                        },
                        {
                            op: 'max',
                            field: 'people',
                            as: 'upper_whisker_people'
                        }
                    ],
                    groupby: ['age']
                }
            ],
            layer: [
                {
                    mark: {
                        type: 'rule',
                        style: 'boxplot-rule'
                    },
                    encoding: {
                        x: { field: 'age', type: 'quantitative' },
                        y: {
                            field: 'lower_whisker_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        },
                        y2: {
                            field: 'lower_box_people',
                            type: 'quantitative'
                        }
                    }
                },
                {
                    mark: {
                        type: 'rule',
                        style: 'boxplot-rule'
                    },
                    encoding: {
                        x: { field: 'age', type: 'quantitative' },
                        y: {
                            field: 'upper_box_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        },
                        y2: {
                            field: 'upper_whisker_people',
                            type: 'quantitative'
                        }
                    }
                },
                {
                    mark: {
                        type: 'bar',
                        style: 'boxplot-box',
                        size: 5
                    },
                    encoding: {
                        x: { field: 'age', type: 'quantitative' },
                        y: {
                            field: 'lower_box_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        },
                        y2: {
                            field: 'upper_box_people',
                            type: 'quantitative'
                        },
                        color: { value: 'skyblue' }
                    }
                },
                {
                    mark: {
                        type: 'tick',
                        orient: 'horizontal',
                        style: 'boxplot-median',
                        color: 'white',
                        size: 5
                    },
                    encoding: {
                        x: { field: 'age', type: 'quantitative' },
                        y: {
                            field: 'mid_box_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        }
                    }
                }
            ]
        });
    });
    it('should produce an error if neither the x axis or y axis is specified', function () {
        assert.throws(function () {
            normalize({
                description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
                data: { url: 'data/population.json' },
                mark: {
                    type: 'boxplot',
                    extent: 'min-max'
                },
                encoding: {
                    color: { value: 'skyblue' }
                }
            }, defaultConfig);
        }, Error, 'Need a valid continuous axis for boxplots');
    });
    it('should produce a warning if continuous axis has aggregate property', log.wrap(function (localLogger) {
        var aggregate = 'min';
        var type = 'boxplot';
        normalize({
            description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
            data: { url: 'data/population.json' },
            mark: {
                type: type,
                extent: 'min-max',
                size: 14
            },
            encoding: {
                x: { field: 'age', type: 'ordinal' },
                y: {
                    aggregate: aggregate,
                    field: 'people',
                    type: 'quantitative',
                    axis: { title: 'population' }
                },
                color: { value: 'skyblue' }
            }
        }, defaultConfig);
        assert.equal(localLogger.warns[0], log.message.errorBarContinuousAxisHasCustomizedAggregate(aggregate, type));
    }));
    it('should produce an error if build 1D boxplot with a discrete axis', function () {
        assert.throws(function () {
            normalize({
                description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
                data: { url: 'data/population.json' },
                mark: 'boxplot',
                encoding: {
                    x: { field: 'age', type: 'ordinal' }
                }
            }, defaultConfig);
        }, Error, 'Need a valid continuous axis for boxplots');
    });
    it('should produce an error if both axes are discrete', function () {
        assert.throws(function () {
            normalize({
                description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
                data: { url: 'data/population.json' },
                mark: {
                    type: 'boxplot',
                    extent: 'min-max'
                },
                encoding: {
                    x: { field: 'age', type: 'ordinal' },
                    y: {
                        field: 'age',
                        type: 'ordinal',
                        axis: { title: 'age' }
                    },
                    color: { value: 'skyblue' }
                }
            }, defaultConfig);
        }, Error, 'Need a valid continuous axis for boxplots');
    });
    it('should produce an error if in 2D boxplot both axes are not valid field definitions', function () {
        assert.throws(function () {
            normalize({
                description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
                data: { url: 'data/population.json' },
                mark: {
                    type: 'boxplot',
                    extent: 'min-max'
                },
                encoding: {
                    x: { field: 'age', type: 'ordinal' },
                    y: {
                        type: 'ordinal',
                        axis: { title: 'age' }
                    },
                    color: { value: 'skyblue' }
                }
            }, defaultConfig);
        }, Error, 'Need a valid continuous axis for boxplots');
    });
    it('should produce an error if 1D boxplot only axis is discrete', function () {
        assert.throws(function () {
            normalize({
                description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
                data: { url: 'data/population.json' },
                mark: 'boxplot',
                encoding: {
                    x: { field: 'age', type: 'ordinal' },
                    color: { value: 'skyblue' }
                }
            }, defaultConfig);
        }, Error, 'Need a valid continuous axis for boxplots');
    });
    it('should produce correct layered specs for vertical boxplot with two quantitative axes and specify orientation with orient', function () {
        assert.deepEqual(normalize({
            description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
            data: { url: 'data/population.json' },
            mark: {
                type: 'boxplot',
                orient: 'vertical',
                extent: 'min-max'
            },
            encoding: {
                x: { field: 'age', type: 'quantitative' },
                y: {
                    field: 'people',
                    type: 'quantitative',
                    axis: { title: 'population' }
                },
                color: { value: 'skyblue' }
            }
        }, defaultConfig), {
            description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
            data: { url: 'data/population.json' },
            transform: [
                {
                    aggregate: [
                        {
                            op: 'q1',
                            field: 'people',
                            as: 'lower_box_people'
                        },
                        {
                            op: 'q3',
                            field: 'people',
                            as: 'upper_box_people'
                        },
                        {
                            op: 'median',
                            field: 'people',
                            as: 'mid_box_people'
                        },
                        {
                            op: 'min',
                            field: 'people',
                            as: 'lower_whisker_people'
                        },
                        {
                            op: 'max',
                            field: 'people',
                            as: 'upper_whisker_people'
                        }
                    ],
                    groupby: ['age']
                }
            ],
            layer: [
                {
                    mark: {
                        type: 'rule',
                        style: 'boxplot-rule'
                    },
                    encoding: {
                        x: { field: 'age', type: 'quantitative' },
                        y: {
                            field: 'lower_whisker_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        },
                        y2: {
                            field: 'lower_box_people',
                            type: 'quantitative'
                        }
                    }
                },
                {
                    mark: {
                        type: 'rule',
                        style: 'boxplot-rule'
                    },
                    encoding: {
                        x: { field: 'age', type: 'quantitative' },
                        y: {
                            field: 'upper_box_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        },
                        y2: {
                            field: 'upper_whisker_people',
                            type: 'quantitative'
                        }
                    }
                },
                {
                    mark: {
                        type: 'bar',
                        style: 'boxplot-box',
                        size: 14
                    },
                    encoding: {
                        x: { field: 'age', type: 'quantitative' },
                        y: {
                            field: 'lower_box_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        },
                        y2: {
                            field: 'upper_box_people',
                            type: 'quantitative'
                        },
                        color: { value: 'skyblue' }
                    }
                },
                {
                    mark: {
                        type: 'tick',
                        orient: 'horizontal',
                        style: 'boxplot-median',
                        size: 14,
                        color: 'white'
                    },
                    encoding: {
                        x: { field: 'age', type: 'quantitative' },
                        y: {
                            field: 'mid_box_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        }
                    }
                }
            ]
        });
    });
    it('should produce correct layered specs for horizontal boxplot with two quantitative axes and specify orientation with orient', function () {
        assert.deepEqual(normalize({
            description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
            data: { url: 'data/population.json' },
            mark: {
                type: 'boxplot',
                orient: 'horizontal',
                extent: 'min-max'
            },
            encoding: {
                y: { field: 'age', type: 'quantitative' },
                x: {
                    field: 'people',
                    type: 'quantitative',
                    axis: { title: 'population' }
                },
                color: { value: 'skyblue' }
            }
        }, defaultConfig), {
            description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
            data: { url: 'data/population.json' },
            transform: [
                {
                    aggregate: [
                        {
                            op: 'q1',
                            field: 'people',
                            as: 'lower_box_people'
                        },
                        {
                            op: 'q3',
                            field: 'people',
                            as: 'upper_box_people'
                        },
                        {
                            op: 'median',
                            field: 'people',
                            as: 'mid_box_people'
                        },
                        {
                            op: 'min',
                            field: 'people',
                            as: 'lower_whisker_people'
                        },
                        {
                            op: 'max',
                            field: 'people',
                            as: 'upper_whisker_people'
                        }
                    ],
                    groupby: ['age']
                }
            ],
            layer: [
                {
                    mark: {
                        type: 'rule',
                        style: 'boxplot-rule'
                    },
                    encoding: {
                        y: { field: 'age', type: 'quantitative' },
                        x: {
                            field: 'lower_whisker_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        },
                        x2: {
                            field: 'lower_box_people',
                            type: 'quantitative'
                        }
                    }
                },
                {
                    mark: {
                        type: 'rule',
                        style: 'boxplot-rule'
                    },
                    encoding: {
                        y: { field: 'age', type: 'quantitative' },
                        x: {
                            field: 'upper_box_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        },
                        x2: {
                            field: 'upper_whisker_people',
                            type: 'quantitative'
                        }
                    }
                },
                {
                    mark: {
                        type: 'bar',
                        style: 'boxplot-box',
                        size: 14
                    },
                    encoding: {
                        y: { field: 'age', type: 'quantitative' },
                        x: {
                            field: 'lower_box_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        },
                        x2: {
                            field: 'upper_box_people',
                            type: 'quantitative'
                        },
                        color: { value: 'skyblue' }
                    }
                },
                {
                    mark: {
                        type: 'tick',
                        orient: 'vertical',
                        style: 'boxplot-median',
                        color: 'white',
                        size: 14
                    },
                    encoding: {
                        y: { field: 'age', type: 'quantitative' },
                        x: {
                            field: 'mid_box_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        }
                    }
                }
            ]
        });
    });
    it('should produce correct layered specs for vertical boxplot with two quantitative axes and specify orientation with aggregate', function () {
        assert.deepEqual(normalize({
            description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
            data: { url: 'data/population.json' },
            mark: {
                type: 'boxplot',
                extent: 'min-max'
            },
            encoding: {
                x: { field: 'age', type: 'quantitative' },
                y: {
                    field: 'people',
                    type: 'quantitative',
                    aggregate: 'boxplot',
                    axis: { title: 'population' }
                },
                color: { value: 'skyblue' }
            }
        }, defaultConfig), {
            description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
            data: { url: 'data/population.json' },
            transform: [
                {
                    aggregate: [
                        {
                            op: 'q1',
                            field: 'people',
                            as: 'lower_box_people'
                        },
                        {
                            op: 'q3',
                            field: 'people',
                            as: 'upper_box_people'
                        },
                        {
                            op: 'median',
                            field: 'people',
                            as: 'mid_box_people'
                        },
                        {
                            op: 'min',
                            field: 'people',
                            as: 'lower_whisker_people'
                        },
                        {
                            op: 'max',
                            field: 'people',
                            as: 'upper_whisker_people'
                        }
                    ],
                    groupby: ['age']
                }
            ],
            layer: [
                {
                    mark: {
                        type: 'rule',
                        style: 'boxplot-rule'
                    },
                    encoding: {
                        x: { field: 'age', type: 'quantitative' },
                        y: {
                            field: 'lower_whisker_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        },
                        y2: {
                            field: 'lower_box_people',
                            type: 'quantitative'
                        }
                    }
                },
                {
                    mark: {
                        type: 'rule',
                        style: 'boxplot-rule'
                    },
                    encoding: {
                        x: { field: 'age', type: 'quantitative' },
                        y: {
                            field: 'upper_box_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        },
                        y2: {
                            field: 'upper_whisker_people',
                            type: 'quantitative'
                        }
                    }
                },
                {
                    mark: {
                        type: 'bar',
                        style: 'boxplot-box',
                        size: 14
                    },
                    encoding: {
                        x: { field: 'age', type: 'quantitative' },
                        y: {
                            field: 'lower_box_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        },
                        y2: {
                            field: 'upper_box_people',
                            type: 'quantitative'
                        },
                        color: { value: 'skyblue' }
                    }
                },
                {
                    mark: {
                        type: 'tick',
                        orient: 'horizontal',
                        style: 'boxplot-median',
                        color: 'white',
                        size: 14
                    },
                    encoding: {
                        x: { field: 'age', type: 'quantitative' },
                        y: {
                            field: 'mid_box_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        }
                    }
                }
            ]
        });
    });
    it('should produce correct layered specs for horizontal boxplot with two quantitative axes and specify orientation with aggregate', function () {
        assert.deepEqual(normalize({
            description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
            data: { url: 'data/population.json' },
            mark: {
                type: 'boxplot',
                extent: 'min-max'
            },
            encoding: {
                y: { field: 'age', type: 'quantitative' },
                x: {
                    field: 'people',
                    type: 'quantitative',
                    aggregate: 'boxplot',
                    axis: { title: 'population' }
                },
                color: { value: 'skyblue' }
            }
        }, defaultConfig), {
            description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
            data: { url: 'data/population.json' },
            transform: [
                {
                    aggregate: [
                        {
                            op: 'q1',
                            field: 'people',
                            as: 'lower_box_people'
                        },
                        {
                            op: 'q3',
                            field: 'people',
                            as: 'upper_box_people'
                        },
                        {
                            op: 'median',
                            field: 'people',
                            as: 'mid_box_people'
                        },
                        {
                            op: 'min',
                            field: 'people',
                            as: 'lower_whisker_people'
                        },
                        {
                            op: 'max',
                            field: 'people',
                            as: 'upper_whisker_people'
                        }
                    ],
                    groupby: ['age']
                }
            ],
            layer: [
                {
                    mark: {
                        type: 'rule',
                        style: 'boxplot-rule'
                    },
                    encoding: {
                        y: { field: 'age', type: 'quantitative' },
                        x: {
                            field: 'lower_whisker_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        },
                        x2: {
                            field: 'lower_box_people',
                            type: 'quantitative'
                        }
                    }
                },
                {
                    mark: {
                        type: 'rule',
                        style: 'boxplot-rule'
                    },
                    encoding: {
                        y: { field: 'age', type: 'quantitative' },
                        x: {
                            field: 'upper_box_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        },
                        x2: {
                            field: 'upper_whisker_people',
                            type: 'quantitative'
                        }
                    }
                },
                {
                    mark: {
                        type: 'bar',
                        style: 'boxplot-box',
                        size: 14
                    },
                    encoding: {
                        y: { field: 'age', type: 'quantitative' },
                        x: {
                            field: 'lower_box_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        },
                        x2: {
                            field: 'upper_box_people',
                            type: 'quantitative'
                        },
                        color: { value: 'skyblue' }
                    }
                },
                {
                    mark: {
                        type: 'tick',
                        orient: 'vertical',
                        style: 'boxplot-median',
                        color: 'white',
                        size: 14
                    },
                    encoding: {
                        y: { field: 'age', type: 'quantitative' },
                        x: {
                            field: 'mid_box_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        }
                    }
                }
            ]
        });
    });
    it('should produce correct layered specs for vertical boxplot with min and max', function () {
        assert.deepEqual(normalize({
            description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
            data: { url: 'data/population.json' },
            mark: {
                type: 'boxplot',
                extent: 'min-max'
            },
            encoding: {
                x: { field: 'age', type: 'ordinal' },
                y: {
                    field: 'people',
                    type: 'quantitative',
                    axis: { title: 'population' }
                },
                color: { value: 'skyblue' }
            }
        }, defaultConfig), {
            description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
            data: { url: 'data/population.json' },
            transform: [
                {
                    aggregate: [
                        {
                            op: 'q1',
                            field: 'people',
                            as: 'lower_box_people'
                        },
                        {
                            op: 'q3',
                            field: 'people',
                            as: 'upper_box_people'
                        },
                        {
                            op: 'median',
                            field: 'people',
                            as: 'mid_box_people'
                        },
                        {
                            op: 'min',
                            field: 'people',
                            as: 'lower_whisker_people'
                        },
                        {
                            op: 'max',
                            field: 'people',
                            as: 'upper_whisker_people'
                        }
                    ],
                    groupby: ['age']
                }
            ],
            layer: [
                {
                    mark: {
                        type: 'rule',
                        style: 'boxplot-rule'
                    },
                    encoding: {
                        x: { field: 'age', type: 'ordinal' },
                        y: {
                            field: 'lower_whisker_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        },
                        y2: {
                            field: 'lower_box_people',
                            type: 'quantitative'
                        }
                    }
                },
                {
                    mark: {
                        type: 'rule',
                        style: 'boxplot-rule'
                    },
                    encoding: {
                        x: { field: 'age', type: 'ordinal' },
                        y: {
                            field: 'upper_box_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        },
                        y2: {
                            field: 'upper_whisker_people',
                            type: 'quantitative'
                        }
                    }
                },
                {
                    mark: {
                        type: 'bar',
                        style: 'boxplot-box',
                        size: 14
                    },
                    encoding: {
                        x: { field: 'age', type: 'ordinal' },
                        y: {
                            field: 'lower_box_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        },
                        y2: {
                            field: 'upper_box_people',
                            type: 'quantitative'
                        },
                        color: { value: 'skyblue' }
                    }
                },
                {
                    mark: {
                        type: 'tick',
                        orient: 'horizontal',
                        style: 'boxplot-median',
                        color: 'white',
                        size: 14
                    },
                    encoding: {
                        x: { field: 'age', type: 'ordinal' },
                        y: {
                            field: 'mid_box_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        }
                    }
                }
            ]
        });
    });
    it('should produce correct layered specs for horizontal boxplot with min and max', function () {
        assert.deepEqual(normalize({
            description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
            data: { url: 'data/population.json' },
            mark: {
                type: 'boxplot',
                extent: 'min-max'
            },
            encoding: {
                y: { field: 'age', type: 'ordinal' },
                x: {
                    field: 'people',
                    type: 'quantitative',
                    axis: { title: 'population' }
                },
                color: { value: 'skyblue' }
            }
        }, defaultConfig), {
            description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
            data: { url: 'data/population.json' },
            transform: [
                {
                    aggregate: [
                        {
                            op: 'q1',
                            field: 'people',
                            as: 'lower_box_people'
                        },
                        {
                            op: 'q3',
                            field: 'people',
                            as: 'upper_box_people'
                        },
                        {
                            op: 'median',
                            field: 'people',
                            as: 'mid_box_people'
                        },
                        {
                            op: 'min',
                            field: 'people',
                            as: 'lower_whisker_people'
                        },
                        {
                            op: 'max',
                            field: 'people',
                            as: 'upper_whisker_people'
                        }
                    ],
                    groupby: ['age']
                }
            ],
            layer: [
                {
                    mark: {
                        type: 'rule',
                        style: 'boxplot-rule'
                    },
                    encoding: {
                        y: { field: 'age', type: 'ordinal' },
                        x: {
                            field: 'lower_whisker_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        },
                        x2: {
                            field: 'lower_box_people',
                            type: 'quantitative'
                        }
                    }
                },
                {
                    mark: {
                        type: 'rule',
                        style: 'boxplot-rule'
                    },
                    encoding: {
                        y: { field: 'age', type: 'ordinal' },
                        x: {
                            field: 'upper_box_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        },
                        x2: {
                            field: 'upper_whisker_people',
                            type: 'quantitative'
                        }
                    }
                },
                {
                    mark: {
                        type: 'bar',
                        style: 'boxplot-box',
                        size: 14
                    },
                    encoding: {
                        y: { field: 'age', type: 'ordinal' },
                        x: {
                            field: 'lower_box_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        },
                        x2: {
                            field: 'upper_box_people',
                            type: 'quantitative'
                        },
                        color: { value: 'skyblue' }
                    }
                },
                {
                    mark: {
                        type: 'tick',
                        orient: 'vertical',
                        style: 'boxplot-median',
                        color: 'white',
                        size: 14
                    },
                    encoding: {
                        y: { field: 'age', type: 'ordinal' },
                        x: {
                            field: 'mid_box_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        }
                    }
                }
            ]
        });
    });
    it('should produce correct layered specs for horizontal with no nonpositional encoding properties boxplot with min and max', function () {
        assert.deepEqual(normalize({
            description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
            data: { url: 'data/population.json' },
            mark: {
                type: 'boxplot',
                extent: 'min-max'
            },
            encoding: {
                y: { field: 'age', type: 'ordinal' },
                x: {
                    field: 'people',
                    type: 'quantitative',
                    axis: { title: 'population' }
                }
            }
        }, defaultConfig), {
            description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
            data: { url: 'data/population.json' },
            transform: [
                {
                    aggregate: [
                        {
                            op: 'q1',
                            field: 'people',
                            as: 'lower_box_people'
                        },
                        {
                            op: 'q3',
                            field: 'people',
                            as: 'upper_box_people'
                        },
                        {
                            op: 'median',
                            field: 'people',
                            as: 'mid_box_people'
                        },
                        {
                            op: 'min',
                            field: 'people',
                            as: 'lower_whisker_people'
                        },
                        {
                            op: 'max',
                            field: 'people',
                            as: 'upper_whisker_people'
                        }
                    ],
                    groupby: ['age']
                }
            ],
            layer: [
                {
                    mark: {
                        type: 'rule',
                        style: 'boxplot-rule'
                    },
                    encoding: {
                        y: { field: 'age', type: 'ordinal' },
                        x: {
                            field: 'lower_whisker_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        },
                        x2: {
                            field: 'lower_box_people',
                            type: 'quantitative'
                        }
                    }
                },
                {
                    mark: {
                        type: 'rule',
                        style: 'boxplot-rule'
                    },
                    encoding: {
                        y: { field: 'age', type: 'ordinal' },
                        x: {
                            field: 'upper_box_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        },
                        x2: {
                            field: 'upper_whisker_people',
                            type: 'quantitative'
                        }
                    }
                },
                {
                    mark: {
                        type: 'bar',
                        style: 'boxplot-box',
                        size: 14
                    },
                    encoding: {
                        y: { field: 'age', type: 'ordinal' },
                        x: {
                            field: 'lower_box_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        },
                        x2: {
                            field: 'upper_box_people',
                            type: 'quantitative'
                        }
                    }
                },
                {
                    mark: {
                        type: 'tick',
                        orient: 'vertical',
                        style: 'boxplot-median',
                        color: 'white',
                        size: 14
                    },
                    encoding: {
                        y: { field: 'age', type: 'ordinal' },
                        x: {
                            field: 'mid_box_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        }
                    }
                }
            ]
        });
    });
    it('should produce correct layered specs for 1D boxplot with only x', function () {
        assert.deepEqual(normalize({
            description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
            data: { url: 'data/population.json' },
            mark: {
                type: 'boxplot',
                extent: 'min-max'
            },
            encoding: {
                x: {
                    field: 'people',
                    type: 'quantitative',
                    axis: { title: 'population' }
                }
            }
        }, defaultConfig), {
            description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
            data: { url: 'data/population.json' },
            transform: [
                {
                    aggregate: [
                        {
                            op: 'q1',
                            field: 'people',
                            as: 'lower_box_people'
                        },
                        {
                            op: 'q3',
                            field: 'people',
                            as: 'upper_box_people'
                        },
                        {
                            op: 'median',
                            field: 'people',
                            as: 'mid_box_people'
                        },
                        {
                            op: 'min',
                            field: 'people',
                            as: 'lower_whisker_people'
                        },
                        {
                            op: 'max',
                            field: 'people',
                            as: 'upper_whisker_people'
                        }
                    ],
                    groupby: []
                }
            ],
            layer: [
                {
                    mark: {
                        type: 'rule',
                        style: 'boxplot-rule'
                    },
                    encoding: {
                        x: {
                            field: 'lower_whisker_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        },
                        x2: {
                            field: 'lower_box_people',
                            type: 'quantitative'
                        }
                    }
                },
                {
                    mark: {
                        type: 'rule',
                        style: 'boxplot-rule'
                    },
                    encoding: {
                        x: {
                            field: 'upper_box_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        },
                        x2: {
                            field: 'upper_whisker_people',
                            type: 'quantitative'
                        }
                    }
                },
                {
                    mark: {
                        type: 'bar',
                        style: 'boxplot-box',
                        size: 14
                    },
                    encoding: {
                        x: {
                            field: 'lower_box_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        },
                        x2: {
                            field: 'upper_box_people',
                            type: 'quantitative'
                        }
                    }
                },
                {
                    mark: {
                        type: 'tick',
                        orient: 'vertical',
                        style: 'boxplot-median',
                        color: 'white',
                        size: 14
                    },
                    encoding: {
                        x: {
                            field: 'mid_box_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        }
                    }
                }
            ]
        });
    });
    it('should produce correct layered specs for 1D boxplot with only y', function () {
        assert.deepEqual(normalize({
            description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
            data: { url: 'data/population.json' },
            mark: {
                type: 'boxplot',
                extent: 'min-max'
            },
            encoding: {
                y: {
                    field: 'people',
                    type: 'quantitative',
                    axis: { title: 'population' }
                }
            }
        }, defaultConfig), {
            description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
            data: { url: 'data/population.json' },
            transform: [
                {
                    aggregate: [
                        {
                            op: 'q1',
                            field: 'people',
                            as: 'lower_box_people'
                        },
                        {
                            op: 'q3',
                            field: 'people',
                            as: 'upper_box_people'
                        },
                        {
                            op: 'median',
                            field: 'people',
                            as: 'mid_box_people'
                        },
                        {
                            op: 'min',
                            field: 'people',
                            as: 'lower_whisker_people'
                        },
                        {
                            op: 'max',
                            field: 'people',
                            as: 'upper_whisker_people'
                        }
                    ],
                    groupby: []
                }
            ],
            layer: [
                {
                    mark: {
                        type: 'rule',
                        style: 'boxplot-rule'
                    },
                    encoding: {
                        y: {
                            field: 'lower_whisker_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        },
                        y2: {
                            field: 'lower_box_people',
                            type: 'quantitative'
                        }
                    }
                },
                {
                    mark: {
                        type: 'rule',
                        style: 'boxplot-rule'
                    },
                    encoding: {
                        y: {
                            field: 'upper_box_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        },
                        y2: {
                            field: 'upper_whisker_people',
                            type: 'quantitative'
                        }
                    }
                },
                {
                    mark: {
                        type: 'bar',
                        style: 'boxplot-box',
                        size: 14
                    },
                    encoding: {
                        y: {
                            field: 'lower_box_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        },
                        y2: {
                            field: 'upper_box_people',
                            type: 'quantitative'
                        }
                    }
                },
                {
                    mark: {
                        type: 'tick',
                        orient: 'horizontal',
                        style: 'boxplot-median',
                        color: 'white',
                        size: 14
                    },
                    encoding: {
                        y: {
                            field: 'mid_box_people',
                            type: 'quantitative',
                            axis: { title: 'population' }
                        }
                    }
                }
            ]
        });
    });
    it("should not overwrite transform with boxplot's transfroms", function () {
        var outputSpec = normalize({
            data: { url: 'data/population.json' },
            mark: {
                type: 'boxplot',
                extent: 'min-max'
            },
            transform: [{ calculate: 'age * 2', as: 'age2' }],
            encoding: { x: { field: 'age', type: 'ordinal' }, y: { field: 'people', type: 'quantitative', title: 'population' } }
        }, defaultConfig);
        var transforms = outputSpec.transform;
        expect(transforms).toBeDefined();
        expect(transforms).not.toHaveLength(0);
        expect(transforms[0]).toEqual({ calculate: 'age * 2', as: 'age2' });
    });
});
describe('normalizeBoxIQR', function () {
    it('should produce correct layered specs for vertical boxplot with two quantitative axes and use default orientation for a 1.5 * IQR whiskers with boxplot mark type', function () {
        expect(normalize({
            description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
            data: { url: 'data/population.json' },
            mark: 'boxplot',
            encoding: {
                x: { field: 'age', type: 'quantitative' },
                y: {
                    field: 'people',
                    type: 'quantitative',
                    axis: { title: 'population' }
                },
                color: { value: 'skyblue' }
            }
        }, defaultConfig)).toEqual({
            description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
            data: { url: 'data/population.json' },
            layer: [
                {
                    transform: [
                        {
                            aggregate: [
                                {
                                    op: 'q1',
                                    field: 'people',
                                    as: 'lower_box_people'
                                },
                                {
                                    op: 'q3',
                                    field: 'people',
                                    as: 'upper_box_people'
                                },
                                {
                                    op: 'median',
                                    field: 'people',
                                    as: 'mid_box_people'
                                },
                                {
                                    op: 'min',
                                    field: 'people',
                                    as: 'min_people'
                                },
                                {
                                    op: 'max',
                                    field: 'people',
                                    as: 'max_people'
                                }
                            ],
                            groupby: ['age']
                        },
                        {
                            calculate: 'datum.upper_box_people - datum.lower_box_people',
                            as: 'iqr_people'
                        },
                        {
                            calculate: "min(datum.upper_box_people + datum.iqr_people * " + defaultConfig.boxplot.extent + ", datum.max_people)",
                            as: 'upper_whisker_people'
                        },
                        {
                            calculate: "max(datum.lower_box_people - datum.iqr_people * " + defaultConfig.boxplot.extent + ", datum.min_people)",
                            as: 'lower_whisker_people'
                        }
                    ],
                    layer: [
                        {
                            mark: {
                                type: 'rule',
                                style: 'boxplot-rule'
                            },
                            encoding: {
                                x: { field: 'age', type: 'quantitative' },
                                y: {
                                    field: 'lower_whisker_people',
                                    type: 'quantitative',
                                    axis: { title: 'population' }
                                },
                                y2: {
                                    field: 'lower_box_people',
                                    type: 'quantitative'
                                }
                            }
                        },
                        {
                            mark: {
                                type: 'rule',
                                style: 'boxplot-rule'
                            },
                            encoding: {
                                x: { field: 'age', type: 'quantitative' },
                                y: {
                                    field: 'upper_box_people',
                                    type: 'quantitative',
                                    axis: { title: 'population' }
                                },
                                y2: {
                                    field: 'upper_whisker_people',
                                    type: 'quantitative'
                                }
                            }
                        },
                        {
                            mark: {
                                type: 'bar',
                                style: 'boxplot-box',
                                size: 14
                            },
                            encoding: {
                                x: { field: 'age', type: 'quantitative' },
                                y: {
                                    field: 'lower_box_people',
                                    type: 'quantitative',
                                    axis: { title: 'population' }
                                },
                                y2: {
                                    field: 'upper_box_people',
                                    type: 'quantitative'
                                },
                                color: { value: 'skyblue' }
                            }
                        },
                        {
                            mark: {
                                type: 'tick',
                                orient: 'horizontal',
                                style: 'boxplot-median',
                                color: 'white',
                                size: 14
                            },
                            encoding: {
                                x: { field: 'age', type: 'quantitative' },
                                y: {
                                    field: 'mid_box_people',
                                    type: 'quantitative',
                                    axis: { title: 'population' }
                                }
                            }
                        }
                    ]
                },
                {
                    transform: [
                        {
                            window: [
                                {
                                    op: 'q1',
                                    field: 'people',
                                    as: 'lower_box_people'
                                },
                                {
                                    op: 'q3',
                                    field: 'people',
                                    as: 'upper_box_people'
                                }
                            ],
                            groupby: ['age'],
                            frame: [null, null]
                        },
                        {
                            filter: '(datum.people < datum.lower_box_people - 1.5 * (datum.upper_box_people - datum.lower_box_people)) || (datum.people > datum.upper_box_people + 1.5 * (datum.upper_box_people - datum.lower_box_people))'
                        }
                    ],
                    mark: {
                        type: 'point',
                        style: 'boxplot-outliers'
                    },
                    encoding: {
                        x: { field: 'age', type: 'quantitative' },
                        y: {
                            field: 'people',
                            type: 'quantitative'
                        }
                    }
                }
            ]
        });
    });
    it('should produce correct layered specs for vertical boxplot with two quantitative axes and use default orientation for a 1.5 * IQR whiskers', function () {
        expect(normalize({
            description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
            data: { url: 'data/population.json' },
            mark: {
                type: 'boxplot',
                extent: 1.5
            },
            encoding: {
                x: { field: 'age', type: 'quantitative' },
                y: {
                    field: 'people',
                    type: 'quantitative',
                    axis: { title: 'population' }
                },
                color: { value: 'skyblue' }
            }
        }, defaultConfig)).toEqual({
            description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
            data: { url: 'data/population.json' },
            layer: [
                {
                    transform: [
                        {
                            aggregate: [
                                {
                                    op: 'q1',
                                    field: 'people',
                                    as: 'lower_box_people'
                                },
                                {
                                    op: 'q3',
                                    field: 'people',
                                    as: 'upper_box_people'
                                },
                                {
                                    op: 'median',
                                    field: 'people',
                                    as: 'mid_box_people'
                                },
                                {
                                    op: 'min',
                                    field: 'people',
                                    as: 'min_people'
                                },
                                {
                                    op: 'max',
                                    field: 'people',
                                    as: 'max_people'
                                }
                            ],
                            groupby: ['age']
                        },
                        {
                            calculate: 'datum.upper_box_people - datum.lower_box_people',
                            as: 'iqr_people'
                        },
                        {
                            calculate: 'min(datum.upper_box_people + datum.iqr_people * 1.5, datum.max_people)',
                            as: 'upper_whisker_people'
                        },
                        {
                            calculate: 'max(datum.lower_box_people - datum.iqr_people * 1.5, datum.min_people)',
                            as: 'lower_whisker_people'
                        }
                    ],
                    layer: [
                        {
                            mark: {
                                type: 'rule',
                                style: 'boxplot-rule'
                            },
                            encoding: {
                                x: { field: 'age', type: 'quantitative' },
                                y: {
                                    field: 'lower_whisker_people',
                                    type: 'quantitative',
                                    axis: { title: 'population' }
                                },
                                y2: {
                                    field: 'lower_box_people',
                                    type: 'quantitative'
                                }
                            }
                        },
                        {
                            mark: {
                                type: 'rule',
                                style: 'boxplot-rule'
                            },
                            encoding: {
                                x: { field: 'age', type: 'quantitative' },
                                y: {
                                    field: 'upper_box_people',
                                    type: 'quantitative',
                                    axis: { title: 'population' }
                                },
                                y2: {
                                    field: 'upper_whisker_people',
                                    type: 'quantitative'
                                }
                            }
                        },
                        {
                            mark: {
                                type: 'bar',
                                style: 'boxplot-box',
                                size: 14
                            },
                            encoding: {
                                x: { field: 'age', type: 'quantitative' },
                                y: {
                                    field: 'lower_box_people',
                                    type: 'quantitative',
                                    axis: { title: 'population' }
                                },
                                y2: {
                                    field: 'upper_box_people',
                                    type: 'quantitative'
                                },
                                color: { value: 'skyblue' }
                            }
                        },
                        {
                            mark: {
                                type: 'tick',
                                orient: 'horizontal',
                                style: 'boxplot-median',
                                color: 'white',
                                size: 14
                            },
                            encoding: {
                                x: { field: 'age', type: 'quantitative' },
                                y: {
                                    field: 'mid_box_people',
                                    type: 'quantitative',
                                    axis: { title: 'population' }
                                }
                            }
                        }
                    ]
                },
                {
                    transform: [
                        {
                            window: [
                                {
                                    op: 'q1',
                                    field: 'people',
                                    as: 'lower_box_people'
                                },
                                {
                                    op: 'q3',
                                    field: 'people',
                                    as: 'upper_box_people'
                                }
                            ],
                            groupby: ['age'],
                            frame: [null, null]
                        },
                        {
                            filter: '(datum.people < datum.lower_box_people - 1.5 * (datum.upper_box_people - datum.lower_box_people)) || (datum.people > datum.upper_box_people + 1.5 * (datum.upper_box_people - datum.lower_box_people))'
                        }
                    ],
                    mark: {
                        type: 'point',
                        style: 'boxplot-outliers'
                    },
                    encoding: {
                        x: { field: 'age', type: 'quantitative' },
                        y: {
                            field: 'people',
                            type: 'quantitative'
                        }
                    }
                }
            ]
        });
    });
    it('should produce correct layered specs for vertical IQR boxplot where color encodes the mean of the people field', function () {
        expect(normalize({
            description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
            data: { url: 'data/population.json' },
            mark: {
                type: 'boxplot',
                extent: 1.5
            },
            encoding: {
                x: { field: 'age', type: 'quantitative' },
                y: {
                    field: 'people',
                    type: 'quantitative',
                    axis: { title: 'population' }
                },
                color: {
                    aggregate: 'mean',
                    field: 'people',
                    type: 'quantitative'
                }
            }
        }, defaultConfig)).toEqual({
            description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
            data: { url: 'data/population.json' },
            layer: [
                {
                    transform: [
                        {
                            aggregate: [
                                {
                                    op: 'mean',
                                    field: 'people',
                                    as: 'mean_people'
                                },
                                {
                                    op: 'q1',
                                    field: 'people',
                                    as: 'lower_box_people'
                                },
                                {
                                    op: 'q3',
                                    field: 'people',
                                    as: 'upper_box_people'
                                },
                                {
                                    op: 'median',
                                    field: 'people',
                                    as: 'mid_box_people'
                                },
                                {
                                    op: 'min',
                                    field: 'people',
                                    as: 'min_people'
                                },
                                {
                                    op: 'max',
                                    field: 'people',
                                    as: 'max_people'
                                }
                            ],
                            groupby: ['age']
                        },
                        {
                            calculate: 'datum.upper_box_people - datum.lower_box_people',
                            as: 'iqr_people'
                        },
                        {
                            calculate: 'min(datum.upper_box_people + datum.iqr_people * 1.5, datum.max_people)',
                            as: 'upper_whisker_people'
                        },
                        {
                            calculate: 'max(datum.lower_box_people - datum.iqr_people * 1.5, datum.min_people)',
                            as: 'lower_whisker_people'
                        }
                    ],
                    layer: [
                        {
                            mark: {
                                type: 'rule',
                                style: 'boxplot-rule'
                            },
                            encoding: {
                                x: { field: 'age', type: 'quantitative' },
                                y: {
                                    field: 'lower_whisker_people',
                                    type: 'quantitative',
                                    axis: { title: 'population' }
                                },
                                y2: {
                                    field: 'lower_box_people',
                                    type: 'quantitative'
                                }
                            }
                        },
                        {
                            mark: {
                                type: 'rule',
                                style: 'boxplot-rule'
                            },
                            encoding: {
                                x: { field: 'age', type: 'quantitative' },
                                y: {
                                    field: 'upper_box_people',
                                    type: 'quantitative',
                                    axis: { title: 'population' }
                                },
                                y2: {
                                    field: 'upper_whisker_people',
                                    type: 'quantitative'
                                }
                            }
                        },
                        {
                            mark: {
                                type: 'bar',
                                style: 'boxplot-box',
                                size: 14
                            },
                            encoding: {
                                x: { field: 'age', type: 'quantitative' },
                                y: {
                                    field: 'lower_box_people',
                                    type: 'quantitative',
                                    axis: { title: 'population' }
                                },
                                y2: {
                                    field: 'upper_box_people',
                                    type: 'quantitative'
                                },
                                color: {
                                    field: 'mean_people',
                                    title: 'Mean of people',
                                    type: 'quantitative'
                                }
                            }
                        },
                        {
                            mark: {
                                type: 'tick',
                                orient: 'horizontal',
                                style: 'boxplot-median',
                                color: 'white',
                                size: 14
                            },
                            encoding: {
                                x: { field: 'age', type: 'quantitative' },
                                y: {
                                    field: 'mid_box_people',
                                    type: 'quantitative',
                                    axis: { title: 'population' }
                                }
                            }
                        }
                    ]
                },
                {
                    transform: [
                        {
                            window: [
                                {
                                    op: 'q1',
                                    field: 'people',
                                    as: 'lower_box_people'
                                },
                                {
                                    op: 'q3',
                                    field: 'people',
                                    as: 'upper_box_people'
                                }
                            ],
                            groupby: ['age'],
                            frame: [null, null]
                        },
                        {
                            filter: '(datum.people < datum.lower_box_people - 1.5 * (datum.upper_box_people - datum.lower_box_people)) || (datum.people > datum.upper_box_people + 1.5 * (datum.upper_box_people - datum.lower_box_people))'
                        }
                    ],
                    mark: {
                        type: 'point',
                        style: 'boxplot-outliers'
                    },
                    encoding: {
                        x: { field: 'age', type: 'quantitative' },
                        y: {
                            field: 'people',
                            type: 'quantitative'
                        }
                    }
                }
            ]
        });
    });
});
//# sourceMappingURL=boxplot.test.js.map