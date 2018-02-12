// import all we need
import {page} from '../rep.e2e';
import _ from 'lodash';
import staticConf from '../static';
import golden from '../golden';

exports.LoadingTests = function() {
// run test set for loading molecules from different sources
  describe('have an opportunity to load molecule from different sources, e. g.', function() {

    const suite = this;

    before(function() {
// use static file to list all sources and corresponding molecules
      _.each(staticConf.loadList, (loads) => {
// create a test for every source
// we have different manners to call for one and the same source now a days
// must reflect it in static file
        suite.addTest(it(`load a molecule from ${loads.source} in ${loads.format} format`, function() {
          return page.runScript(`load "${loads.link}"\nview "${loads.view}"`)
            .then(() => page.waitUntilTitleContains(`${loads.moleculeId}`))
            .then(() => page.waitUntilRebuildIsDone())
            .then(() => golden.shouldMatch(`${loads.moleculeId}`, this));
        }));
      });
    });

// well, it is confusing but a user must not necessarily know what we do here
// we do not load a molecule but get rid of it here
// it is easier to find a bug with molecule image if you know beforehand
// that there should be no of it
    it('load a molecule with an appropriate orientation', function() {
      return page.openTerminal()
        .then(() => page.runScript('clear\nreset'))
        .then(() => page.waitUntilRebuildIsDone());
    });
  });
};
