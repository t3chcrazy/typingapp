const { AndroidConfig, withAndroidManifest } = require("expo/config-plugins")

const { getMainActivityOrThrow, getMainApplicationOrThrow } = AndroidConfig.Manifest

async function modifyActivityConfig(
    config,
    androidManifest
) {
    const mainActivity = getMainActivityOrThrow(androidManifest)
    const mainApplication = getMainApplicationOrThrow(androidManifest)
    mainApplication.$["android:usesCleartextTraffic"] = "true"
    mainActivity.$['android:windowSoftInputMode'] = "adjustResize"
    return androidManifest
}

module.exports = function(config) {
    return withAndroidManifest(config, async config => {
      config.modResults = await modifyActivityConfig(config, config.modResults);
      return config;
    });
};