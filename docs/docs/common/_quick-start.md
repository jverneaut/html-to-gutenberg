**This project is built with ESM and requires Node.js version 20.0.0 or later.**

### 1. Scaffold an HTML To Gutenberg blocks plugin

```bash
cd wp-content/plugins
npx @wordpress/create-block --template html-to-gutenberg-template
```

This sets up everything you need — pre-configured to work with **HTML To Gutenberg**.

### 2. Start development

```bash
cd html-to-gutenberg-blocks # Your block plugin directory
npm run start
```

### 3. Edit the default block

Open `wp-content/plugins/html-to-gutenberg-blocks/src/block.html` and make changes to the default block.

**HTML To Gutenberg** will automatically convert it into a working Gutenberg block.

### 4. Add additional blocks

To create additional blocks, simply add new `.html` files in the src folder.

Each HTML file becomes its own block and is automatically processed by HTML To Gutenberg.

```txt
src/
├── block.html         # Default block (can be safely deleted)
├── hero.html          # Another custom block
├── testimonial.html   # Yet another one
```

:::info Note about blocks deletion
When you delete an HTML file from src, its corresponding Gutenberg block is removed on the next build.

However, depending on your setup, you may also need to manually delete the removed block folder inside the build/ directory to fully clean it up.
:::

### 5. Activate your plugin

Enable your block in the WordPress admin and drop it into any page or post.

<details>
<summary>Can't see your plugin on the admin?</summary>

:::warning
Make sure you set a **title** when generating the plugin with `@wordpress/create-block`. If you don’t, the plugin may not appear in the WordPress plugins page.

If you forgot to add one, open the root PHP file of your plugin and add a `Plugin Name` like so:

```php
<?php

/**
 * Plugin Name:       HTML To Gutenberg Blocks <------ Add a name here
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

</details>

### 6. Build for production

```bash
npm run build
```

Bundles and minifies your blocks.
