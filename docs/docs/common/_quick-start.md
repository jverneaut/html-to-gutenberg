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

5. Build for production

```bash
npm run build
```

This bundles and minifies the block to makes it ready for production.
