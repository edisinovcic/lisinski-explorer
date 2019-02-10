var request = require('request');

function getReleases(callback) {
  request('https://solc-bin.ethereum.org/bin/list.json', function(error, response, body) {
    if(error) {
      console.log('Failed to fetch solc releases list, ', error);
      return callback({});
    }
    return callback(JSON.parse(body).builds.reverse())
  })
}

function getSupportedReleases(callback) {
  return getReleases(function(releases) {
    return callback(
      releases.filter(function (release) {
        var versionParts = release.version.split('.');
        // exclude versions less than 0.3.0 and prereleases
        if(release.prerelease || (parseInt(versionParts[0]) === 0 && parseInt(versionParts[1]) < 3)) {
          return false;
        }
        return true;
      })
    )
  })
}

function isSupportedVersion(versions, longVersion) {
  return getRelease(versions, longVersion).length > 0;
}

function getRelease(versions, longVersion) {
  return versions.filter(function(version) {
    return version.longVersion === longVersion
  });
}

module.exports = {
  getReleases,
  getRelease,
  getSupportedReleases,
  isSupportedVersion
}
