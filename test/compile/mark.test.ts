// TODO: write all test below by calling compileMark()

describe('Mark (Path based Mark)', function() {
  describe('horizontal Line', function() {
    describe('without a path field', function() {
      it('should sort by X', function() {
        // TODO
      });
    });

    describe('with a path field', function() {
      it('should sort by the path field', function() {
        // TODO
      });
    });

    describe('with path fields', function() {
      it('should sort by the path fields', function() {
        // TODO
      });
    });

    describe('with a color field', function() {
      it('should facet lines into subgroups', function() {
        // TODO
      });
    });

    describe('with a color field and an order field', function() {
      it('should facet lines into subgroups and sort layer of each subgroup by order field', function() {
        // TODO
      });
    });
  });
  describe('vertical Line', function() {
    describe('without a path field', function() {
      it('should sort by Y', function() {
        // TODO
      });
    });
  });

  describe('Horizontal Area', function() {
    describe('with color', function() {
      it('should be stacked by default', function() {
        // TODO
      });

      it('should not be stacked if config.mark.stack is `"no-stack"`', function() {
        // TODO
      });

      // TODO add cases based on different stack offset
    });
  });
});

describe('Mark (Non-path based Mark)', function() {
  describe('Point', function() {
    it('should not have background group', function() {
      // Have only one mark group returned
      // TODO
    });

    it('should not have sort transform by default', function() {
      // TODO
    });

    it('should sort by an order field if it has an order field', function() {
      // TODO
    });
  });

  describe('Bar', function() {
    describe('with a color field', function() {
      it('should be stacked by default', function() {
        // TODO
      });

      it('should order stack by the color field (in descending order)', function() {
        // TODO
      });

      it('should not be stacked if config.mark.stack is `"no-stack"`', function() {
        // TODO
      });
    });

    describe('with a color field and an order field', function() {
      it('should order stack by the order field', function() {
        // TODO
      });
    });

    describe('with a color field and order fields', function() {
      it('should order stack by the order fields', function() {
        // TODO
      });
    });
  });

  describe('Text', function() {
    describe('with config.mark.applyColorToBackground', function() {
      it('should have background', function() {
        // TODO
      });
    });
  });
});
