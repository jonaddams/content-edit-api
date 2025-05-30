// This is a hack, because JSDocs does not include the interface when there is just
// a type export or no export default in a file.
// export default {};

/**
 * Describes the properties of a text block detected on a page.
 *
 * Contains the text, the bounding box in PDF coordinates, and the anchor point.
 * @public
 * @memberof PSPDFKit.ContentEditing
 * @interface TextBlock
 * @seealso PSPDFKit.ContentEditing.Session#getTextBlocks
 */

/**
 * Unique identifier for the text block.
 * @public
 * @instance
 * @member {string} id
 * @memberof PSPDFKit.ContentEditing.TextBlock
 */

/**
 * The text content of the text block.
 *
 * If a text block contains multiple lines, the text will be a single string with new line characters.
 * @public
 * @instance
 * @member {string} text
 * @memberof PSPDFKit.ContentEditing.TextBlock
 */

/**
 * The current bounding box of the text block, in PDF coordinates.
 * @public
 * @instance
 * @member {object} boundingBox
 * @property {number} top - The top coordinate of the bounding box.
 * @property {number} left - The left coordinate of the bounding box.
 * @property {number} width - The width of the bounding box.
 * @property {number} height - The height of the bounding box.
 * @memberof PSPDFKit.ContentEditing.TextBlock
 */

/**
 * The anchor point of the text block.
 * @public
 * @instance
 * @member {object} anchor
 * @property {number} x - The x coordinate of the anchor point.
 * @property {number} y - The y coordinate of the anchor point.
 * @memberof PSPDFKit.ContentEditing.TextBlock
 */

/**
 * The maximum width of the text block.
 * @public
 * @instance
 * @member {number} maxWidth
 * @memberof PSPDFKit.ContentEditing.TextBlock
 */
export type TextBlock = {
  id: string;
  text: string;
  boundingBox: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  anchor: { x: number; y: number };
  maxWidth: number;
};

/**
 * Describes the properties used to update a text block.
 *
 * This is a partial text block that contains the id of the text block and the new text.
 * It is used to update the text block in the document.
 * @public
 * @memberof PSPDFKit.ContentEditing
 * @interface UpdatedTextBlock
 * @seealso PSPDFKit.ContentEditing.Session#updateTextBlocks
 */

/**
 * ***required***
 *
 * Unique identifier for the text block.
 * @public
 * @instance
 * @member {string} id
 * @memberof PSPDFKit.ContentEditing.UpdatedTextBlock
 */

/**
 * The new text content of the text block.
 * @public
 * @instance
 * @member {?string} text
 * @memberof PSPDFKit.ContentEditing.UpdatedTextBlock
 */

/**
 * The anchor point of the text block.
 * @public
 * @instance
 * @member {?object} anchor
 * @property {?number} x - The x coordinate of the anchor point.
 * @property {?number} y - The y coordinate of the anchor point.
 * @memberof PSPDFKit.ContentEditing.UpdatedTextBlock
 */

/**
 * The maximum width of the text block.
 * @public
 * @instance
 * @member {?number} maxWidth
 * @memberof PSPDFKit.ContentEditing.UpdatedTextBlock
 */
export type UpdatedTextBlock = {
  id: string;
  text?: string;
  anchor?: { x?: number; y?: number };
  maxWidth?: number;
};

/**
 * This describes the content editor session returned by {@link PSPDFKit.Instance#beginContentEditingSession}.
 *
 * It is independent of the content editor UI session, which is used to display the content editor UI. At one time, only one content editing session can be active, either this session or a UI session. Starting the UI session will deactivate this session.
 * Also, if the contents of an opened document are modified while this session is active, the session will be deactivated.
 *
 * Using this requires a license that includes the Content Editor component.
 * @public
 * @memberof PSPDFKit.ContentEditing
 * @interface Session
 */

/**
 * Completes the current editing session and saves all changes. Document will reload.
 * @returns A promise that resolves when the changes have been successfully saved.
 * @public
 * @function commit
 * @memberof PSPDFKit.ContentEditing.Session
 * @instance
 */
/**
 * Completes the current editing session without persisting any changes.
 * @returns A promise that resolves when the session is successfully discarded.
 * @public
 * @function discard
 * @memberof PSPDFKit.ContentEditing.Session
 * @instance
 */
/**
 * Retrieves all text blocks for a specific page.
 * @param {number} pageIndex - The index of the page to retrieve text blocks for.
 * @returns {Promise.<PSPDFKit.ContentEditing.TextBlock[]>} A promise that resolves with an array of TextBlocks for the given page.
 * @public
 * @function getTextBlocks
 * @memberof PSPDFKit.ContentEditing.Session
 * @throws {PSPDFKit.Error} If the page index is out of bounds.
 * @instance
 */
/**
 * Indicates whether the session is currently active.
 * @public
 * @instance
 * @member {boolean} active
 * @memberof PSPDFKit.ContentEditing.Session
 */
/**
 * Updates an array of text blocks with partial data.
 *
 * If a text block for the corresponding page wasn't previously loaded via `getTextBlocks`,
 * it will be loaded in the background automatically.
 * @param {PSPDFKit.ContentEditing.UpdatedTextBlock[]} textBlocks - Array of UpdatedTextBlock objects to update.
 *  Each object must be identified through its ID. Other fields are optional and will be updated in the document if not null.
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 * @public
 * @function updateTextBlocks
 * @memberof PSPDFKit.ContentEditing.Session
 * @throws {PSPDFKit.Error} If the ID of any text block is missing or doesn't exist.
 * @instance
 */
export type Session = {
  commit: () => Promise<void>;
  discard: () => Promise<void>;
  getTextBlocks: (pageIndex: number) => Promise<TextBlock[]>;
  updateTextBlocks: (textBlocks: UpdatedTextBlock[]) => Promise<void>;
  active: boolean;
};
