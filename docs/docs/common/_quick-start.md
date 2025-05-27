### 1. Scaffold your block

```bash
cd wp-content/plugins
npx @wordpress/create-block --template html-to-gutenberg-template
```

This sets up everything you need, pre-wired to use HTML To Gutenberg.

### 2. Start development

```bash
cd my-awesome-block # Your block plugin path
npm run start
```

### 3. Make changes to your block

Open `wp-content/plugins/my-awesome-block/src/block.html` and make changes to your block. Save the file, HTML To Gutenberg automatically converts it to native Gutenberg block.

### 4. Activate your plugin

Enable your block via WordPress admin and drop it into any page or post.

:::warning
Be sure to include a title for you block when generating the plugin with `@wordpress/create-block` or your plugin may not show at all inside your WordPRess extensions page as it is also used for the plugin name.

If you failed to do so, edit the root PHP file of your plugin and add a plugin name:

```php
<?php

/**
 * Plugin Name:       Your plugin name <------ Add a name here
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       textdomain
 *
 * @package CreateBlock
 */
```

:::

5. Build for production

```bash
npm run build
```

This bundles and minifies the block to makes it ready for production.
