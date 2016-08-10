import { expect } from 'chai';
import sample from '../../src/utils/sample';

describe('sample util', function() {

  it('is available', function() {
    const output = sample();
    expect(output).not.to.be.null;
  });

  it('returns a sample message', function() {
    const output = sample();
    expect(output).to.contain('sample function');
  });
});
