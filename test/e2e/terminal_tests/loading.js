import {page} from '../rep.e2e';
import _ from 'lodash';
import staticConf from '../static';
import golden from '../golden';

describe('have an opportunity to load molecule from different sources, e. g.', function() {

  const suite = this;

  before(function() {
    _.each(staticConf.loadList, (loads) => {
      suite.addTest(it(`load a molecule from ${loads.source} in ${loads.format} format`, function() {
        return page.runScript(`load "${loads.link}"\nview "${loads.view}"`)
          .then(() => page.waitUntilTitleContains(`${loads.moleculeId}`))
          .then(() => page.waitUntilRebuildIsDone())
          .then(() => golden.shouldMatch(`${loads.moleculeId}`, this));
      }));
    });
  });

  it('load a molecule with an appropriate orientation', function() {
    return page.openTerminal()
      .then(() => page.runScript('clear\nreset'))
      .then(() => page.waitUntilRebuildIsDone());
  });
});
