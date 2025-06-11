#!/bin/bash

echo "Preparing to deploy to Render..."
echo "Make sure you have created a Render account and set up a static site service."
echo "This script assumes you have already pushed your code to GitHub."

echo ""
echo "Follow these steps to deploy:"
echo "1. Log in to your Render account at https://render.com"
echo "2. Click 'New +' and select 'Static Site'"
echo "3. Connect your GitHub repository containing this project"
echo "4. Configure as follows:"
echo "   - Name: Your preferred site name"
echo "   - Build Command: Leave empty or put '# no build command needed'"
echo "   - Publish Directory: '.'"
echo "5. Click 'Create Static Site'"

echo ""
echo "Your site will be deployed at: https://your-site-name.onrender.com"
echo "Remember to update your social media links in index.html before deploying!"
